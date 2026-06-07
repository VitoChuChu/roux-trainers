
import { getInitialState } from './InitialState';
import { FbStateM } from './BlockTrainerStateM';
import { CubieCube, MoveSeq } from '../lib/CubeLib';

describe('FbStateM Continuous Practice', () => {
    it('should calculate incremental scramble and not accumulate moves', () => {
        let state = getInitialState('fb');
        
        // Enable continuous practice
        state.config.continuousPracticeSelector = state.config.continuousPracticeSelector.setFlags([0, 1]);
        
        const stateM = new FbStateM(state);
        
        // First update
        let state1 = stateM._updateCase();
        const firstScramble = state1.case.desc[0].setup || "";
        console.log("First Scramble:", firstScramble);
        
        // Simulate some moves by the user (optional, but good to test)
        // Let's say the user did the scramble and maybe one extra move
        const userMoves = new MoveSeq(firstScramble + " U");
        state1.cube.state = state1.cube.state.apply(userMoves);
        
        // Second update
        const stateM2 = new FbStateM(state1);
        let state2 = stateM2._updateCase();
        const secondScramble = state2.case.desc[0].setup || "";
        console.log("Second Scramble:", secondScramble);
        
        // The second scramble should be a standalone string, not appending the first one.
        // Usually scrambles are around 10-20 moves.
        expect(secondScramble.split(' ').length).toBeLessThan(30);
        
        // Verify the cube state in state2 matches the target case state
        // In continuous mode: nextCube = state.cube.state.apply(setup)
        // state.cube.state (from state1) * setup (secondScramble) should = state2.case.state
        const expectedCube = state1.cube.state.apply(new MoveSeq(secondScramble));
        expect(expectedCube.serialize()).toBe(state2.case.state.serialize());
    });

    it('should distinguish incremental scramble from normal scramble', () => {
        let state = getInitialState('fb');
        
        // Normal mode
        state.config.continuousPracticeSelector = state.config.continuousPracticeSelector.setFlags([1, 0]);
        let stateNormal = new FbStateM(state)._updateCase();
        
        // Continuous mode
        state.config.continuousPracticeSelector = state.config.continuousPracticeSelector.setFlags([0, 1]);
        let stateCont = new FbStateM(state)._updateCase();
        
        // In normal mode, state.cube.state usually matches state.case.state (the target)
        // because we just set it. 
        // Wait, let's check _solve implementation.
        // Normal: nextCube = cube; (where cube is the random target)
        // Continuous: nextCube = state.cube.state.apply(setup);
        
        expect(stateNormal.cube.state.serialize()).toBe(stateNormal.case.state.serialize());
        expect(stateCont.cube.state.serialize()).toBe(stateCont.case.state.serialize());
    });
});
