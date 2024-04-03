import React, { useEffect, useState, PropsWithChildren } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { SwipeableDrawer, useMediaQuery } from '@material-ui/core';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';

type StyleProps = { md: boolean };
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    paper: {
      bottom: (props: StyleProps) => (props.md ? 'auto' : 0),
      margin: '0 auto',
      maxWidth: '100%',
      maxHeight: '75vh',
      width: 1250,
      borderRadius: (props: StyleProps) => (props.md ? 10 : '10px 10px 0 0'),
      boxShadow: theme.shadows[5],
      padding: (props: StyleProps) =>
        props.md ? theme.spacing(3) : theme.spacing(1, 2, 4),
    },
  })
);

type ModalProps = PropsWithChildren<{
  open: boolean;
}>;

export const Modal: React.FC<ModalProps> = ({ children, open }) => {
  const [_open, setOpen] = useState(open);
  useEffect(() => setOpen(open), [open]);

  const navigate = useNavigate();
  const location = useLocation();

  const md = useMediaQuery('(min-width:768px)');
  const classes = useStyles({ md });

  return (
    <SwipeableDrawer
      anchor={'bottom'}
      open={_open}
      onOpen={() => null}
      onClose={() => {
        if (!_open) return;
        setOpen(false);
        setTimeout(() => {
          if (location.state?.fromTop) navigate(-1);
          else
            navigate(
              `${location.pathname.replace(/\/tasks\/.+$/, '')}${
                location.search
              }`,
              { replace: true }
            );
        }, 200);
      }}
      disableDiscovery={true}
      classes={classes}
    >
      {children}
    </SwipeableDrawer>
  );
};
