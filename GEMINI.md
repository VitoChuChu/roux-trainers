# Project Plan: Continuous Practice (连续练习模式)

## Overview
Add "Continuous Practice" mode to all trainers. This mode allows users to transition to the next practice case without fully resetting/solving the cube. It calculates an incremental scramble from the current cube state to the next case's state.

## Current Status
- `BlockTrainerStateM` (Base for FS, FB, FBLP, SS) has core logic in `_solve`.
- `CmllStateM` has initial logic.
- `Translation.tsx` and `Config.tsx` have UI/Config entries.
- Basic math tests exist in `Continuous.test.tsx`.

## Engineering Standards
1. **Versioning**: **ALWAYS** update the version string in `src/Version.tsx` after any functional code change or bug fix. Use the format `YYYYMMDD_vX`.
2. **TDD Driven**: Every change must have a test case.
3. **Contextual Precedence**: Adhere to existing architectural patterns and styles.

## Strategic Goals
1. **TDD Driven**: Every change must have a test case.
2. **Left Block First**: Polish the experience for FS/FB/FBLP/SS.
3. **Step Distinction**: Clearly distinguish transition moves in the scramble display.
4. **Full Coverage**: Extend to LSE and SS trainers.

## Task List

### Phase 1: Planning & Infrastructure
- [x] Create detailed test suite for state transitions in `BlockTrainerStateM`.
- [x] Verify existing logic for `FbStateM` and `FbdrStateM`.

### Phase 2: Left Block Polish (FS/FB/FBLP/SS)
- [x] **Distinguish Steps (Option C)**: Use CSS/Colors to highlight incremental scrambles.
    - *Status*: Completed. Added `RETURN:` and `NEXT:` labels with visual separator.
- [x] **Scramble Management**: Ensure incremental scrambles do not accumulate.
    - *Status*: Completed. Using Solution + Scramble approach.
- [x] **Orientation Sync**: Fixed by implementing proper orientation-to-move mapping and ensuring basis synchronization during transitions.
    - *Status*: Completed.
- [x] **Bug Fixes**: Fixed the issue where ` // ` separator caused incorrect simulator state updates.

### Phase 3: Extension to Other Trainers
- [x] **LSE Trainer**: Continuous logic inherited/implemented and verified.
- [x] **SS Trainer**: Continuous logic inherited/implemented and verified.
- [x] **Verify CMLL**: Implemented with RETURN/NEXT split and fixed orientation sync.
- [x] **OLLCP**: Implemented with RETURN/NEXT split and fixed orientation sync.

## Known Issues for Next Session
(None currently. All previously reported visual and logic inconsistencies in Continuous Mode have been addressed.)


## Technical Notes
- Incremental Scramble formula: `M = currentCube.inv() * targetCube`.
- Display: Current `isContinuous ? X.CONFIG.INCREMENTAL_SCRAMBLE : X.COMMON.SCRAMBLE`.
