import PendingActionsIcon from '@mui/icons-material/PendingActions';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import {ListItem, ListItemIcon, ListItemText} from "@mui/material";

const BookingItem = ({status,startDate,endDate}) => {

  // Helper function to get the correct icon based on the status
  const getStatusIcon = () => {
    switch (status) {
    case 'pending':
      return <PendingActionsIcon sx={{ color: 'warning.main' }} />;
    case 'accepted':
      return <CheckCircleIcon sx={{ color: 'success.main' }} />;
    case 'declined':
      return <CancelIcon sx={{ color: 'error.main' }}/>;
    default:
      return <PendingActionsIcon sx={{ color: 'grey.500'}}/>;
    }
  };


  // Helper function to get the right text based on status
  const getStatusText = () => {
    switch (status) {
    case 'pending':
      return 'Pending';
    case 'accepted':
      return 'Accepted';
    case 'declined':
      return 'Declined';
    default:
      return 'Unknown';
    }
  };
  
  return (
    <ListItem>
      <ListItemIcon>
        {getStatusIcon()}
      </ListItemIcon>
      <ListItemText
        primary={`From ${startDate} to ${endDate}`}
        secondary={getStatusText()}
      />
    </ListItem>
  ); 
};

export default BookingItem;