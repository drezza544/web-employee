import * as React from 'react';
import {
  Box,
  Drawer,
  IconButton,
  Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

type Props = {
    title?: string,
    visible?: boolean
    onClose?: () => void
    renderDrawer: React.ReactNode
}

const FormDrawer: React.FC<Props> = ({
    title,
    renderDrawer,
    onClose,
    visible
}) => {
    return (
        <div>
            <Drawer
                anchor="right"
                open={visible}
                onClose={onClose}
            >
                <Box
                    sx={{
                        width: 300,
                        padding: 3,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 2,
                    }}
                    role="presentation"
                >
                    <div 
                        className="header-drawer"
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: 15,
                        }}
                    >
                        <Typography variant="h6">{title}</Typography>
                        <IconButton style={{ outline: 'none'}} onClick={onClose}>
                            <CloseIcon />
                        </IconButton>
                    </div>

                    {renderDrawer}
                </Box>
            </Drawer>
        </div>
    );
}
export default FormDrawer;