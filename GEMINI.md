# Project Plan: Continuous Practice (连续练习模式)

## Overview
Add "Continuous Practice" mode to all trainers. This mode allows users to transition to the next practice case without fully resetting/solving the cube. It calculates an incremental scramble from the current cube state to the next case's state.

## Current Status
- `BlockTrainerStateM` (Base for FS, FB, FBLP, SS) has core logic in `_solve`.
- `CmllStateM` has initial logic.
- `Translation.tsx` and `Config.tsx` have UI/Config entries.
- Basic math tests exist in `Continuous.test.tsx`.

## Strategic Goals
1. **TDD Driven**: Every change must have a test case.
2. **Left Block First**: Polish the experience for FS/FB/FBLP/SS.
3. **Step Distinction**: Clearly distinguish transition moves in the scramble display.
4. **Full Coverage**: Extend to LSE and SS trainers.

## Task List

### Phase 1: Planning & Infrastructure
- [ ] Create detailed test suite for state transitions in `BlockTrainerStateM`.
- [ ] Verify existing logic for `FbStateM` and `FbdrStateM`.

### Phase 2: Left Block Polish (FS/FB/FBLP/SS)
- [x] **Distinguish Steps (Option C)**: Use CSS/Colors to highlight incremental scrambles.
    - *Status*: Completed. Added `RETURN:` and `NEXT:` labels with visual separator.
- [x] **Scramble Management**: Ensure incremental scrambles do not accumulate.
    - *Status*: Completed. Using Solution + Scramble approach.
- [!] **Orientation Sync**: Ensure target state matches user orientation.
    - *Status*: Partially addressed. Added `changeBasis` logic to sync simulator state with view orientation.
    - *Known Issue*: User reports issues still persist (e.g., cube appearing incorrect after 1st transition).

### Phase 3: Extension to Other Trainers
- [x] **LSE Trainer**: Continuous logic inherited/implemented.
- [x] **SS Trainer**: Continuous logic inherited/implemented.
- [x] **Verify CMLL**: Implemented with RETURN/NEXT split.
- [x] **OLLCP**: Implemented with RETURN/NEXT split.

## Known Issues for Next Session
1. **Visual State Inconsistency**: In Continuous Mode, the 3D cube might still show an incorrect state (appearing solved or wrong colors) after transitioning to the 2nd or 3rd case, especially when using custom FB orientations (e.g., White bottom, Red bridge).
2. **Refinement of `_solve` transition**: Re-verify if `nextBasis.apply(normalScramble)` correctly accounts for the coordinate system shift expected by the UI.


## Technical Notes
- Incremental Scramble formula: `M = currentCube.inv() * targetCube`.
- Display: Current `isContinuous ? X.CONFIG.INCREMENTAL_SCRAMBLE : X.COMMON.SCRAMBLE`.
