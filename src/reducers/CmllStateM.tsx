import { AppState, BatchState, CaseState, StateT  } from "../Types";
import { Config } from '../Config';
import { alg_generator_from_group, alg_generator_from_cases, CaseDesc, createAlg, alg_generator_from_cases_contain} from "../lib/Algs";
import { CubieCube, Move, CubeUtil, MoveSeq } from '../lib/CubeLib';
import { AbstractStateM } from "./AbstractStateM";
import {initialize as min2phase_init, solve as min2phase_solve} from "../lib/min2phase/min2phase-wrapper"
import { arrayEqual, rand_choice } from "../lib/Math";
import { CachedSolver } from "../lib/CachedSolver";

export abstract class CmllStateM extends AbstractStateM {
    _get2PhaseSolution(cube: CubieCube): CaseDesc {
        // Aha! f = g(b) but you modified b later, and f won't update!

        let m2_away = false
        if (cube.tp[0] !== 0) {
            m2_away = true
            cube = cube.apply("M2")
        }
        console.assert(arrayEqual(cube.tp, new CubieCube().tp))

        const transformed_cube = cube.to_cstimer_cube()
        console.assert( transformed_cube.is_solveable(), "Cube must be solveable")
        min2phase_init();
        let solution = min2phase_solve(transformed_cube);
        if (m2_away) {
            solution += " M2"
        }
        const algDesc: CaseDesc = createAlg("scramble", solution, "scramble")
        console.log(solution);
        return algDesc;
    }

    _generateSingleCmllCase(batch_mode: boolean = false): CaseState {
        let state = this.state;
        let { config } = state;
        let { cmllCaseSelector, triggerSelector, cmllAufSelector, nmcllSelector, hyperOriSelector } = config;

        const isHyperOri = hyperOriSelector.getActiveName() !== "off" ;
        const isHyperOriFB = hyperOriSelector.getActiveName() !== "F/B" ;
        let generator = (() => {
            if (!isHyperOri) {
                return alg_generator_from_cases(cmllCaseSelector.kind, cmllCaseSelector.getActiveNames());
            } else {
                return alg_generator_from_cases_contain(nmcllSelector.kind, nmcllSelector.getActiveNames().map(x => `nmcll-${x}`))
            }
        })();
        let trig_generator = batch_mode ? () => createAlg("None", "", "trigger") : alg_generator_from_group(triggerSelector);
        let u_auf_generator =alg_generator_from_group(cmllAufSelector);
        let post_auf_generator = () => {
            const choices = (isHyperOriFB) ? ["U", "U'"] : ["", "U2"]
            return rand_choice(choices)
        }
        let trigger_alg: CaseDesc = trig_generator();
        let cmll_alg: CaseDesc = generator();
        let u_auf_alg: CaseDesc = u_auf_generator();
        let post_auf_alg = post_auf_generator();
        let alg_str = trigger_alg.algs[0] + " " + u_auf_alg.algs[0] + " " + cmll_alg.algs[0] + post_auf_alg;
        let moves: Move[] = new MoveSeq(alg_str).inv().moves;

        let lse_cube: CubieCube
        while (true) {
            lse_cube = CubeUtil.get_random_lse().apply(moves)
            if (lse_cube.is_solveable()) {
                break;
            }
        }
        let solution = batch_mode ? createAlg("none", "", "scramble") : this._get2PhaseSolution(lse_cube);

        return {
            state: lse_cube,
            desc: [trigger_alg, u_auf_alg, cmll_alg, solution]
        }
    }

    _generateCase(): AppState {
        let state = this.state;
        let { orientationSelector, continuousPracticeSelector } = state.config;
        let ori_generator = alg_generator_from_group(orientationSelector);

        let ori: string = ori_generator().id;
        let case_ = this._generateSingleCmllCase();

        const isContinuous = continuousPracticeSelector && 
                             continuousPracticeSelector.getActiveName() === "on";

        const oriMoves = CubieCube.getOriMoves(ori);
        if (isContinuous) {
            // Transition = Return(to next basis) + Scramble(next)
            const currentCube = state.cube.state;
            const nextBasis = new CubieCube(); // Internal target is always standard basis
            
            const diffToBasis = currentCube.inv().multiply(nextBasis);
            const returnMoves = CachedSolver.get("min2phase").solve(diffToBasis, 0, 20, 1)[0]?.inv().toString() || "";
            
            const normalScramble = this._get2PhaseSolution(case_.state).algs[0];
            
            let setup = "";
            if (returnMoves.trim().length > 0) {
                setup = `${returnMoves} // ${normalScramble}`;
            } else {
                setup = normalScramble;
            }
            
            case_.desc[3].algs[0] = setup;
            console.log(`[Continuous CMLL] Ori: "${ori}", Return: "${returnMoves}", Next Scramble: "${normalScramble}", Total: "${setup}"`);

            const targetCube = nextBasis.apply(normalScramble);

            return ({
                ...state,
                name: "solving",
                cube: {
                    state: currentCube.apply(setup.replace(" // ", " ")),
                    ori,
                    history: [],
                    levelSuccess: true
                },
                case: {
                    ...case_,
                    state: targetCube
                }
            });
        }

        //console.log("current ori selector's ori ", ori)
        const targetCube = case_.state;
        return ({
            ...state,
            name: "solving",
            cube: {
                state: targetCube,
                ori,
                history: [],
                levelSuccess: true
            },
            case: {
                ...case_,
                state: targetCube
            }
        });
    }
    _generateBatch(batchSize: number = 6): BatchState {
        // Start from solved CMLL cube
        let cases: CaseState[] = [];
        let cube = new CubieCube();
        let algs: string[] = [];

        // Generate N-1 random CMLL cases
        for (let i = 0; i < batchSize - 1; i++) {
            let caseDesc = this._generateSingleCmllCase(true);
            algs.push(caseDesc.desc[1].algs[0] + " " + caseDesc.desc[2].algs[0]);
            caseDesc.desc[3] = createAlg("none", `${i+1} / ${batchSize}`, "scramble");
            cases.push(caseDesc);
        }
        let totalAlg = algs.join(" ");
        cube = cube.apply(totalAlg);
        let finalCaseDesc = {state: cube, desc: []}
        cases.push(finalCaseDesc);
        console.log("batch cases", cases);
        return { cases, index: 0 };
    }

    onControl(s: string): AppState {
        let state = this.state;
        let batchMode = state.config.cmllBatchModeSelector.getActiveName() === "on";
        let getBatchStateAtIndex = (state: AppState, nextIndex: number) : AppState => {
            if (!state.batch) {
                return state;
            } else {
                const isContinuous = state.config.continuousPracticeSelector && 
                                     state.config.continuousPracticeSelector.getActiveName() === "on";
                let nextCase = state.batch.cases[nextIndex];
                let nextCube = nextCase.state;
                if (isContinuous) {
                    const currentCube = state.cube.state;
                    const targetCube = nextCase.state;
                    const nextBasis = new CubieCube();
                    
                    const diffToBasis = currentCube.inv().multiply(nextBasis);
                    const returnMoves = CachedSolver.get("min2phase").solve(diffToBasis, 0, 20, 1)[0]?.inv().toString() || "";
                    
                    const normalScramble = this._get2PhaseSolution(targetCube).algs[0];
                    
                    let setup = "";
                    if (returnMoves.trim().length > 0) {
                        setup = `${returnMoves} // ${normalScramble}`;
                    } else {
                        setup = normalScramble;
                    }
                    
                    nextCube = currentCube.apply(setup.replace(" // ", " "));
                    // Update the setup for the next case
                    // In CMLL batch mode, we put the scramble moves in desc[3]
                    nextCase.desc[3] = createAlg("none", setup + ` (${nextIndex+1} / ${state.batch.cases.length})`, "scramble");
                }

                return ({
                    ...state,
                    batch: { ...state.batch, index: nextIndex },
                    name: "solving",
                    cube: {
                        state: nextCube,
                        ori: state.cube.ori,
                        history: [],
                        levelSuccess: true
                    },
                    case: nextCase
                });
            }
        }
        if (s === "#space") {
            // SCRAMBLE
            // enter cleared solving state based on selection
            if (batchMode) {
                if (!state.batch || state.batch.index >= state.batch.cases.length - 1) {
                    // Generate new batch
                    let batch = this._generateBatch();
                    let { orientationSelector, continuousPracticeSelector } = state.config;
                    let ori_generator = alg_generator_from_group(orientationSelector);
                    let ori: string = ori_generator().id;

                    const isContinuous = continuousPracticeSelector && 
                                         continuousPracticeSelector.getActiveName() === "on";
                    let nextCube = batch.cases[0].state;
                    if (isContinuous) {
                        const diff = state.cube.state.inv().multiply(batch.cases[0].state);
                        const scramble = CachedSolver.get("min2phase").solve(diff, 0, 20, 1)[0]?.inv();
                        nextCube = state.cube.state.apply(scramble);
                        // In CMLL batch mode, desc[3] is progress.
                        // But maybe we should show the incremental scramble moves in the first case's setup field?
                        // However, CMLL setup is usually desc[desc.length-1].algs[0].
                        // Wait, _generateBatch sets desc[3] to progress.
                    }

                    return ({
                        ...state,
                        batch,
                        name: "solving",
                        cube: {
                            state: nextCube,
                            ori,
                            history: [],
                            levelSuccess: true
                        },
                        case: batch.cases[0]
                    });
                }
 else {
                    let nextIndex = state.batch.index + 1;
                    return getBatchStateAtIndex(state, nextIndex);
                }
            } else {
                // Single case mode
                return this._generateCase();
            }
        }
        // support navigation in batch mode by arrow key <- and ->
        else if ((s === "#left") || (s === "#right")) {
            if (state.batch) {
                let shift = s === "#left" ? -1 : 1;
                let nextIndex = Math.max(0, state.batch.index + shift);
                if (nextIndex >= state.batch.cases.length) {
                    nextIndex = state.batch.cases.length - 1; // stay at end
                }
                return getBatchStateAtIndex(state, nextIndex);
            } else {
                return state;
            }
        }
        else {
            throw new Error("Unrecognized control code");
        }
    }
    onConfig(conf: Config): AppState {
        return this.state;
    }
}
export class CmllSolvingStateM extends CmllStateM {
    onMove(move: string): AppState {
        let state = this.state;
        let moves = new MoveSeq(move).moves;
        if (moves.length > 0) {
            let move = moves[0];
            let cube = state.cube.state.apply(move);
            let cmll_solved = CubeUtil.is_cmll_solved(cube);
            let newState: StateT = cmll_solved ? "solved" : "solving";
            return ({
                ...state,
                cube: {
                    ...state.cube,
                    state: state.cube.state.apply(move),
                    history: [...state.cube.history, move],
                },
                name: newState
            });
        }
        else {
            // Nothing to apply
            return state;
        }
    }
}
export class CmllSolvedStateM extends CmllStateM {
    onMove(move: string): AppState {
        return this.state;
    }
}


export abstract class OllcpStateM extends AbstractStateM {
    _get2PhaseSolution(cube: CubieCube): CaseDesc {
        // Aha! f = g(b) but you modified b later, and f won't update!

        let m2_away = false
        if (cube.tp[0] !== 0) {
            m2_away = true
            cube = cube.apply("M2")
        }
        console.assert(arrayEqual(cube.tp, new CubieCube().tp))

        const transformed_cube = cube.to_cstimer_cube()
        console.assert( transformed_cube.is_solveable(), "Cube must be solveable")
        min2phase_init();
        let solution = min2phase_solve(transformed_cube);
        if (m2_away) {
            solution += " M2"
        }
        const algDesc: CaseDesc = createAlg("scramble", solution, "scramble")
        console.log(solution);
        return algDesc;
    }
    _generateCase(): AppState {
        let state = this.state;
        let { config } = state;
        let { cmllCaseSelector, triggerSelector, cmllAufSelector, orientationSelector, nmcllSelector, hyperOriSelector } = config;

        const isHyperOri = hyperOriSelector.getActiveName() !== "off" ;
        const isHyperOriFB = hyperOriSelector.getActiveName() !== "F/B" ;
        let generator = alg_generator_from_cases(cmllCaseSelector.kind, cmllCaseSelector.getActiveNames());
        let trig_generator = alg_generator_from_group(triggerSelector);
        let u_auf_generator =alg_generator_from_group(cmllAufSelector);
        let ori_generator = alg_generator_from_group(orientationSelector);
        let post_auf_generator = () => {
            const choices = (isHyperOriFB) ? ["U", "U'"] : ["", "U2"]
            return rand_choice(choices)
        }
        let trigger_alg: CaseDesc = trig_generator();
        let cmll_alg: CaseDesc = generator();
        let u_auf_alg: CaseDesc = u_auf_generator();
        let post_auf_alg = post_auf_generator();
        let alg_str = trigger_alg.algs + " " + u_auf_alg.algs + " " + cmll_alg.algs + post_auf_alg;
        let moves: Move[] = new MoveSeq(alg_str).inv().moves;

        let lse_cube: CubieCube
        while (true) {
            lse_cube = CubeUtil.get_random_lse().apply(moves)
            if (lse_cube.is_solveable()) {
                break;
            }
        }
        let solution = this._get2PhaseSolution(lse_cube);

        let ori: string = ori_generator().id;
        const oriMoves = CubieCube.getOriMoves(ori);
        const isContinuous = config.continuousPracticeSelector && 
                             config.continuousPracticeSelector.getActiveName() === "on";

        if (isContinuous) {
            // Transition = Return(to next basis) + Scramble(next)
            const currentCube = state.cube.state;
            const nextBasis = new CubieCube(); // Internal target is always standard basis
            
            const diffToBasis = currentCube.inv().multiply(nextBasis);
            const returnMoves = CachedSolver.get("min2phase").solve(diffToBasis, 0, 20, 1)[0]?.inv().toString() || "";
            
            const normalScramble = solution.algs[0];
            
            let setup = "";
            if (returnMoves.trim().length > 0) {
                setup = `${returnMoves} // ${normalScramble}`;
            } else {
                setup = normalScramble;
            }
            
            solution.algs[0] = setup;
            console.log(`[Continuous OLLCP] Ori: "${ori}", Return: "${returnMoves}", Next Scramble: "${normalScramble}", Total: "${setup}"`);

            const targetCube = nextBasis.apply(normalScramble);

            return ({
                ...state,
                name: "solving",
                cube: {
                    state: currentCube.apply(setup.replace(" // ", " ")),
                    ori,
                    history: [],
                    levelSuccess: true
                },
                case: {
                    state: targetCube,
                    desc: [trigger_alg, u_auf_alg, cmll_alg, solution]
                },
            });
        }

        // ori based on ...?
        const targetCube = lse_cube;
        //console.log("current ori selector's ori ", ori)
        return ({
            ...state,
            name: "solving",
            cube: {
                state: targetCube,
                ori,
                history: [],
                levelSuccess: true
            },
            case: {
                state: targetCube,
                desc: [trigger_alg, u_auf_alg, cmll_alg, solution]
            },
        });
    }
    onControl(s: string): AppState {
        let state = this.state;
        if (s === "#space") {
            // SCRAMBLE
            // enter cleared solving state based on selection
            return this._generateCase();
        }
        else {
            throw new Error("Unrecognized control code");
        }
    }
    onConfig(conf: Config): AppState {
        return this.state;
    }
}

export class OllcpSolvingStateM extends OllcpStateM {
    onMove(move: string): AppState {
        let state = this.state;
        let moves = new MoveSeq(move).moves;
        if (moves.length > 0) {
            let move = moves[0];
            let cube = state.cube.state.apply(move);
            // TODO: fix this
            let cmll_solved = CubeUtil.is_cmll_solved(cube);
            let newState: StateT = cmll_solved ? "solved" : "solving";
            return ({
                ...state,
                cube: {
                    ...state.cube,
                    state: state.cube.state.apply(move),
                    history: [...state.cube.history, move],
                },
                name: newState
            });
        }
        else {
            // Nothing to apply
            return state;
        }
    }
}
export class OllcpSolvedStateM extends OllcpStateM {
    onMove(move: string): AppState {
        return this.state;
    }
}
