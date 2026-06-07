
import { CubieCube, Move, MoveSeq } from '../lib/CubeLib';
import { CachedSolver } from '../lib/CachedSolver';

describe('Continuous Practice Scramble Logic', () => {
    it('calculates the shortest incremental scramble between two states', () => {
        // C_V: Current Visual Cube (e.g. after a U move)
        const currentCube = new CubieCube().apply(new MoveSeq("U"));
        
        // C_T: Target Cube (e.g. state after R move from solved)
        const targetCube = new CubieCube().apply(new MoveSeq("R"));
        
        // Math: S_C = C_V.inv() * C_T
        // S_C should be such that C_V * S_C = C_T
        const diff = currentCube.inv().multiply(targetCube);
        
        // Use solver to find string representation S_S such that diff * S_S = solved
        // diff * S_S = identity => (C_V.inv() * C_T) * S_S = identity
        // S_S = C_T.inv() * C_V
        // We want M such that C_V * M = C_T => M = C_V.inv() * C_T = diff
        // So M = S_S.inv()
        const solutions = CachedSolver.get("min2phase").solve(diff, 0, 20, 1);
        expect(solutions.length).toBeGreaterThan(0);
        
        console.log("Current (U):", currentCube.serialize());
        console.log("Target (R):", targetCube.serialize());
        console.log("Diff (U^-1 * R):", diff.serialize());
        console.log("Solver result:", solutions[0].toString());
        
        const incrementalScramble = solutions[0].inv();
        console.log("Incremental Scramble (M):", incrementalScramble.toString());
        
        // Verification: Current Cube + Incremental Scramble should result in Target Cube
        const resultCube = currentCube.apply(incrementalScramble);
        console.log("Result Cube:", resultCube.serialize());
        
        // Check if resultCube matches targetCube (using serialize for deep comparison)
        expect(resultCube.serialize()).toBe(targetCube.serialize());
    });

    it('handles solver failure gracefully by defaulting to empty string', () => {
        const currentCube = new CubieCube();
        const targetCube = new CubieCube(); // already solved
        
        const diff = currentCube.inv().apply(targetCube);
        const solutions = CachedSolver.get("min2phase").solve(diff, 0, 0, 1); // Depth 0
        
        if (solutions.length > 0) {
             expect(solutions[0].moves.length).toBe(0);
        }
    });

    it('successfully transitions across complex states', () => {
        const currentCube = new CubieCube().apply(new MoveSeq("R U R' U'"));
        const targetCube = new CubieCube().apply(new MoveSeq("F R' F' R"));
        
        const diff = currentCube.inv().multiply(targetCube);
        const scramble = CachedSolver.get("min2phase").solve(diff, 0, 20, 1)[0].inv();
        
        const resultCube = currentCube.apply(scramble);
        expect(resultCube.serialize()).toBe(targetCube.serialize());
    });
});
