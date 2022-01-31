import { useEffect, useState, useCallback } from 'react';

const useAuthSignature = wallet => {
	const [signature, setSignature] = useState(null);

	const getSignature = useCallback(async () => {
		if (!wallet) return;
		const data = Date.now().toString();
		let sign = await wallet.signMessage(data);
		sign = `${data}.${sign}`;
		setSignature(sign);
	}, [wallet]);
	useEffect(() => {
		getSignature();

		return () => setSignature(null);
	}, [getSignature]);

	return signature;
};
export default useAuthSignature;
