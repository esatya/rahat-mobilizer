import { ethers } from 'ethers';
import { getDefaultNetwork } from '../constants/networks';
import DataService from './db';

const ABI = {
	TOKEN: require(`../assets/contracts/RahatERC20.json`),
	RAHAT_ADMIN: require(`../assets/contracts/RahatAdmin.json`),
	RAHAT: require(`../assets/contracts/Rahat.json`),
	ERC20: require(`../assets/contracts/RahatERC20.json`),
	ERC1155: require(`../assets/contracts/RahatERC1155.json`)
};

const DefaultProvider = new ethers.providers.JsonRpcProvider(getDefaultNetwork());
const getAgencyDetails = async agencyAddress => {
	const details = await DataService.getAgency(agencyAddress);
	if (!details) throw Error('Agency does not exists');
	const provider = details.network ? new ethers.providers.JsonRpcProvider(details.network) : DefaultProvider;
	const rahatContract = new ethers.Contract(agencyAddress, ABI.RAHAT.abi, provider);
	const erc20Contract = new ethers.Contract(details.erc20Address, ABI.ERC20.abi, provider);
	const erc1155Contract = new ethers.Contract(details.erc1155Address, ABI.ERC1155.abi, provider);
	const rahatAdminContract = new ethers.Contract(details.adminAddress, ABI.RAHAT_ADMIN.abi, provider);
	return {
		details,
		provider,
		rahatContract,
		erc20Contract,
		erc1155Contract,
		rahatAdminContract
	};
};

const RahatService = (agencyAddress, wallet) => {
	return {
		async getContract() {
			const agency = await getAgencyDetails(agencyAddress);
			return agency.rahatContract.connect(wallet);
		},
		async chargeCustomer(phone, amount) {
			const contract = await this.getContract();
			//let benBalance = await contract.tokenBalance(phone);
			// if (amount > benBalance.toNumber()) {
			// 	// waring token amount is greater than remaining blance
			// }
			const tx = await contract.createClaim(Number(phone), Number(amount));
			return tx.wait();
		},
		async getProjectBalance(projectId) {
			const contract = await this.getContract();
			const hashId = ethers.utils.solidityKeccak256(['string'], [projectId]);
			const balance = await contract.getProjectBalance(hashId);
			return balance.toNumber();
		},
		async verifyCharge(phone, otp) {
			const contract = await this.getContract();
			const tx = await contract.getTokensFromClaim(Number(phone), otp);
			return tx.wait();
		},
		async issueToken(projectId, phone, tokenAmount) {
			const contract = await this.getContract();
			const tx = await contract.issueToken(projectId, Number(phone), tokenAmount);
			return tx.wait();
		},
		async getBeneficiaryToken(phone) {
			const contract = await this.getContract();
			const balance = await contract.erc20Balance(Number(phone));
			return balance.toNumber();
		},
		async getTotalERC1155Balance(phone) {
			const contract = await this.getContract();
			return contract.getTotalERC1155Balance(Number(phone));
		}
	};
};

const TokenService = (agencyAddress, wallet) => {
	return {
		async getContract() {
			const agency = await getAgencyDetails(agencyAddress);
			return wallet ? agency.erc20Contract.connect(wallet) : agency.erc20Contract;
		},
		async getBalance(address) {
			if (!address) address = await DataService.getAddress();
			const contract = await this.getContract();
			return contract.balanceOf(address);
		},
		async transfer(address, amount) {
			const contract = await this.getContract();
			const tx = await contract.transfer(address, Number(amount));
			return tx.wait();
		}
	};
};

const PackageService = (agencyAddress, wallet) => {
	return {
		async getContract() {
			const agency = await getAgencyDetails(agencyAddress);
			return wallet ? agency.erc1155Contract.connect(wallet) : agency.erc1155Contract;
		},
		async issueERC1155ToBeneficiary(projectId, phone, amount, tokenId) {
			const contract = await this.getContract();
			const tx = await contract.createERC1155Claim(
				Number(projectId),
				Number(phone),
				Number(amount),
				Number(tokenId)
			);
			return tx.wait();
		}
	};
};

export { DefaultProvider, RahatService, TokenService, PackageService };
