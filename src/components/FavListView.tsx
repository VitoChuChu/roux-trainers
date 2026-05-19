import React from 'react';
import makeStyles from '@mui/styles/makeStyles';

import {
  Button, IconButton, DialogContent, TextField, DialogContentText
} from '@mui/material';

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';

import { Table, Paper, TableBody, TableCell, TableHead, TableRow } from '@mui/material';

import PlaylistPlayIcon from '@mui/icons-material/PlaylistPlay';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import AddIcon from '@mui/icons-material/Add';
import { AppState, Action, FavCase } from '../Types';
import { all_solvers } from '../lib/CachedSolver';
import { X } from '../Translation';


const useStyles = makeStyles(theme => ({
  table: {
    width: '100%',
    minWidth: 200,
    backgroundColor: theme.palette.background.paper,
  },
}));

export function warnDialog(props: { confirm: () => void} ) {

}

function parseAddString(state: AppState, s : string) : [ FavCase[], boolean] {
  const res : FavCase[] = []

  const allSolvers = new Set(all_solvers);
  for (const line of s.split('\n')) {
    let cols = line.split(',')
    if (cols.length !== 2) continue
    let solver = cols[0].trim().split("|")
    let setup = cols[1].trim()

    if (solver.every(x => allSolvers.has(x))) {
      let case_ : FavCase = {
        mode: state.mode,
        solver,
        setup
      }
      res.push(case_)
    }
  }
  if (res.length > 0) return [res, true]
  else return [ [], false]
}

export default function FavListView(props: { state: AppState, dispatch: React.Dispatch<Action> }) {
  const {state, dispatch} = props
  const classes = useStyles();
  const favList = state.favList.filter(c => c.mode === state.mode)

  const play = (i: number) => {
    dispatch({ type: "favList", content: [ favList[i] ], action: "replay" })
  }
  const remove = () => {
    if (dialogID >= 0 && dialogID < favList.length)
    dispatch({ type: "favList", content: [ favList[dialogID] ], action: "remove" })
  }
  const [ dialogID, setDialogID ] = React.useState(-1)

  const handleClose = () => setDialogID(-1)
  const handleRemove = () => { remove(); setDialogID(-1); }
  const dialogDelete = (<Dialog open={dialogID >= 0} onClose={handleClose} >
    <DialogTitle id="alert-dialog-title">{X.FAV.DELETE_TITLE}</DialogTitle>
    <DialogActions>
      <Button onClick={handleClose} color="primary">
        {X.COMMON.NO}
    </Button>
      <Button onClick={handleRemove} color="primary" autoFocus>
        {X.COMMON.YES}
    </Button>
    </DialogActions>
  </Dialog>)

  const [ addDialogOpen, setAddDialogOpen ] = React.useState(false)
  const [ addString, setAddString ] = React.useState("")
  const handleAdd = () => setAddDialogOpen(true)
  const handleAddClose = () => setAddDialogOpen(false)
  const handleAddSuccess = () => {
    let [res, status] = parseAddString(state, addString)
    if (status) {
      dispatch({ type: "favList", content: res, action: "add" })
    }
    handleAddClose()
  }
  const handleTextChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
    setAddString(event.target.value)
  }
  const dialogAdd = <Dialog open={addDialogOpen} onClose={handleAddClose} aria-labelledby="form-dialog-title">
    <DialogTitle id="form-dialog-title">{X.FAV.ADD_TITLE}</DialogTitle>
    <DialogContent>
      <DialogContentText>
        {X.FAV.ADD_INSTRUCTIONS}
      </DialogContentText>
      <TextField
        autoFocus
        multiline
        margin="dense"
        id="name"
        fullWidth
        onChange={handleTextChange}
        onKeyDown={ (event) => { event.stopPropagation() } }
      />
    </DialogContent>
    <DialogActions>
      <Button onClick={handleAddClose} color="primary">
        {X.COMMON.CANCEL}
    </Button>
      <Button onClick={handleAddSuccess} color="primary">
        {X.FAV.ADD_ALL}
    </Button>
    </DialogActions>
  </Dialog>


  return (
    <div>
    {dialogDelete}
    {dialogAdd}
    <Paper>
      <Table className={classes.table} size="small" >
        <TableHead>
          <TableRow>
            <TableCell align="center"> {X.FAV.SCRAMBLE_HEADER} </TableCell>
            <TableCell align="center" rowSpan={1}>
              <IconButton   onClick={handleAdd} component="span" edge="end" size="small" color="primary">
                <AddIcon />
              </IconButton>
              
            {/* <IconButton component="span" edge="end" size="small" color="primary">
                <FileCopyIcon />
              </IconButton> */}
             </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {favList.map((value, i) => {
            //const labelId = `favlist-label-${i}`;
            return (
              <TableRow key={i}>
                {/* <TableCell align="center" >
                  {/* padding=checkbox <Checkbox></Checkbox> */}

                <TableCell align="center">
                { value.solver.join("|") + "," + value.setup }
                </TableCell>
                <TableCell align="center">
                  <IconButton onFocus={(e: { target: { blur: () => void; }; }) => e.target.blur() } onClick={() => play(i)}
                  component="span" edge="end" size="small" color="primary">
                    <PlaylistPlayIcon />
                  </IconButton>

                  <IconButton onFocus={(e: { target: { blur: () => void; }; }) => e.target.blur() } onClick={() => setDialogID(i)}
                  component="span" edge="end" size="small" color="primary">
                    <DeleteOutlineIcon />
                  </IconButton>

                </TableCell>
              </TableRow>
            )
          })}</TableBody>
      </Table>
    </Paper>
    </div>
  )
}