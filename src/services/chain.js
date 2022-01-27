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

			console.log({ contract });
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
		},
		async issueERC1155ToBeneficiary(projectId, phone, amount, tokenId) {
			const contract = await this.getContract();
			return contract.issueERC1155ToBeneficiary(projectId, Number(phone), amount, tokenId);
		},
		async issueERC20ToBeneficiary(projectId, phone, amount) {
			const contract = await this.getContract();
			const mobilizerRole = await contract.MOBILIZER_ROLE();
			const hasRole = await contract.hasRole(mobilizerRole, '0x9abfd0296a24d81355d83f94c09d40c4f3b64374');
			return contract.issueERC20ToBeneficiary(projectId, Number(phone), Number(amount));
		}
	};
};

const RahatAdminService = (agencyAddress, wallet) => {
	return {
		async getContract() {
			const agency = await getAgencyDetails(agencyAddress);
			return agency.rahatAdminContract.connect(wallet);
		},
		async getProjectERC1155Balances(projectId) {
			const contract = await this.getContract();
			return contract.getProjectERC1155Balances(projectId);
		},
		async getProjecERC20Balance(projectId) {
			const contract = await this.getContract();
			return contract.getProjecERC20Balance(projectId);
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

export { DefaultProvider, RahatService, RahatAdminService, TokenService };
