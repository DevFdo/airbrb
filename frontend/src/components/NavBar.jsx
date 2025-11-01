import * as React from 'react';
import { Link } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import {Button, Menu, MenuItem} from "@mui/material";

export default function NavBar() {
    const auth = false;
    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
            <AppBar position="static">
                <Toolbar>
                    <IconButton
                        size="large"
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        onClick={handleMenu}
                        sx={{ mr: 2 }}
                    >
                        <MenuIcon />
                    </IconButton>
                    {auth && (
                        <div>
                            <Menu
                                id="basic-menu"
                                anchorEl={anchorEl}
                                open={Boolean(anchorEl)}
                                onClose={handleClose}
                                slotProps={{
                                    list: {
                                        'aria-labelledby': 'basic-button',
                                    },
                                }}
                            >
                                <MenuItem onClick={handleClose}>My Host Listing</MenuItem>
                                <MenuItem onClick={handleClose}>All Host Listing</MenuItem>
                            </Menu>
                        </div>
                    )}

                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        AIRBRB
                    </Typography>
                    {auth && (
                        <div>
                            <Button
                                color="inherit"
                                sx={{variant: 'contained'}}>
                                Log out
                            </Button>
                        </div>
                    )}
                    {!auth && (
                        <div>
                            <Button color="inherit"
                                    sx={{ variant: 'contained'}}
                                    component={Link}
                                    to="/login">
                                Get Started
                            </Button>
                        </div>
                    )}
                </Toolbar>
            </AppBar>
    );
}