import Swal from 'sweetalert2';
import DataService from '../../services/db';

const ensureBackup = async () => {
	const { isConfirmed, isDismissed, isDenied } = await Swal.fire({
		title: 'Warning!',
		text: 'Have you really backed up your passphrase ?',
		icon: 'warning',
		showDenyButton: true,
		confirmButtonText: 'Yes',
		denyButtonText: 'Cancel'
	});
};
