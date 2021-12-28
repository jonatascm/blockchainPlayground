// SPDX-License-Identifier: MIT
// OpenZeppelin Contracts v4.4.0 (proxy/transparent/ProxyAdmin.sol)

pragma solidity ^0.8.0;

import "./TransparentUpgradeableProxy.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract ProxyAdmin is Ownable {
    function getProxyImplementation(TransparentUpgradeableProxy proxy)
        public
        view
        virtual
        returns (address)
    {
        // bytes4(keccak256("implementation()")) == 0x5c60da1b
        (bool success, bytes memory returndata) = address(proxy).staticcall(
            hex"5c60da1b"
        );
        require(success);
        return abi.decode(returndata, (address));
    }

    function getProxyAdmin(TransparentUpgradeableProxy proxy)
        public
        view
        virtual
        returns (address)
    {
        // We need to manually run the static call since the getter cannot be flagged as view
        // bytes4(keccak256("admin()")) == 0xf851a440
        (bool success, bytes memory returndata) = address(proxy).staticcall(
            hex"f851a440"
        );
        require(success);
        return abi.decode(returndata, (address));
    }

    function changeProxyAdmin(
        TransparentUpgradeableProxy proxy,
        address newAdmin
    ) public virtual onlyOwner {
        proxy.changeAdmin(newAdmin);
    }

    function upgrade(TransparentUpgradeableProxy proxy, address implementation)
        public
        virtual
        onlyOwner
    {
        proxy.upgradeTo(implementation);
    }

    /**
     * @dev Upgrades `proxy` to `implementation` and calls a function on the new implementation. See
     * {TransparentUpgradeableProxy-upgradeToAndCall}.
     *
     * Requirements:
     *
     * - This contract must be the admin of `proxy`.
     */
    function upgradeAndCall(
        TransparentUpgradeableProxy proxy,
        address implementation,
        bytes memory data
    ) public payable virtual onlyOwner {
        proxy.upgradeToAndCall{value: msg.value}(implementation, data);
    }
}
