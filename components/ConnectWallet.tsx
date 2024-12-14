"use client";

import { Button } from "@/components/ui/button";
import { useWallet } from "@/lib/WalletContext";
import { Loader2, Wallet } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { BSC_NETWORK } from '@/lib/constants';
import { useI18n } from '@/lib/i18n/I18nContext';
import { ThemeToggle } from "./ThemeToggle";
import { EfrogModal } from "./EfrogModal";

const WALLET_OPTIONS = [
  { name: "MetaMask", id: "metamask" },
  { name: "WalletConnect", id: "walletconnect" },
  { name: "Coinbase Wallet", id: "coinbase" },
] as const;

export function ConnectWallet() {
  const {
    address,
    isConnecting,
    error,
    connect,
    disconnect,
  } = useWallet();
  const [isDropDownOpen, setIsDropDownOpen] = useState(false);
  const { toast } = useToast();
  const { t } = useI18n();
  const switchToBscNetwork = async () => {
    if (!window.ethereum) return;

    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: BSC_NETWORK.chainId }],
      });
    } catch (switchError: any) {
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [BSC_NETWORK],
          });
        } catch (addError) {
          toast({
            title: "网络添加失败",
            description: "无法添加 BSC 网络，请手动添加",
            variant: "destructive",
          });
        }
      }
    }
  };

  useEffect(() => {
    if (address && window.ethereum) {
      window.ethereum.request({ method: 'eth_chainId' })
        .then((chainId: string) => {
          if (chainId !== BSC_NETWORK.chainId) {
            promptNetworkSwitch();
          }
        });

      const handleChainChanged = (chainId: string) => {
        if (chainId !== BSC_NETWORK.chainId) {
          promptNetworkSwitch();
        }
      };

      window.ethereum.on('chainChanged', handleChainChanged);

      return () => {
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      };
    }
  }, [address]);

  const promptNetworkSwitch = () => {
    toast({
      title: "切换到 BNB Chain",
      description: "请切换到 BNB Chain 以使用 BNBIntent 平台",
      action: (
        <button
          onClick={switchToBscNetwork}
          className="rounded bg-primary px-3 py-2 text-sm font-medium text-primary-foreground"
        >
          切换网络
        </button>
      ),
    });
  };

  const handleConnect = async (walletId: string) => {
    try {
      console.log('👛 尝试连接钱包:', { walletId });
      if (walletId !== "metamask") {
        console.warn('❌ 不支持的钱包类型:', walletId);
        toast({
          title: "暂不支持",
          description: "目前仅支持 MetaMask 钱包",
          variant: "destructive",
        });
        return;
      }
      await connect();
      console.log('✅ 钱包连接成功');
      await switchToBscNetwork();
    } catch (err) {
      console.error('❌ 钱包连接失败:', err);
    }
  };


  const renderConnect = () => {
    if (address) {
      return (
        <div className="flex items-center gap-2">
         {/* <ThemeToggle />*/}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <Wallet className="h-4 w-4" />
                <span>{address.slice(0, 6)}...{address.slice(-4)}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={disconnect}>
                {t('wallet.disconnect')}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    }
    return <div className="relative">
      {error && <div className="absolute -top-8 right-0 text-sm text-destructive">{error}</div>}
      <DropdownMenu open={isDropDownOpen} onOpenChange={setIsDropDownOpen}>
        <DropdownMenuTrigger asChild>
          {/* 暗黑模式下背景渐变 */}
          <Button
            className="bg-[#3287FF] shadow-[0px_4px_25.7px_rgba(153,153,153,0.13)] rounded-[42px] px-6
            dark:bg-[linear-gradient(90deg,#305AFC_0%,#5DD1FF_100%)] dark:text-foreground
            "
            disabled={isConnecting}>
            {isConnecting ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : null}
            <span>{t('wallet.connect')}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          {WALLET_OPTIONS.map(wallet => (
            <DropdownMenuItem key={wallet.id} onClick={() => handleConnect(wallet.id)}>
              {wallet.name}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  }
  return (
    <>
      <div className="flex items-center gap-2">
        <ThemeToggle />
        {renderConnect()}
      </div>
    </>
  );
} 