"use client";

import { Card } from "@/components/ui/card";
import { Shield, TrendingUp, Binary, Sparkles, Loader2 } from "lucide-react";
import { useEthersContract } from "@/hooks/useEthersContract";
import { Button } from "@/components/ui/button";
import { AdvisorType } from "@/types/advisor";
import { useI18n } from '@/lib/i18n/I18nContext';

interface AdvisorSelectionProps {
  onAdvisorSelect: (advisorType: AdvisorType) => void;
}

export function AdvisorSelection({ onAdvisorSelect }: AdvisorSelectionProps) {
  const { t } = useI18n();
  const { address, unlockAdvisor, unlockingAdvisor, checkAccess } = useEthersContract();

  const advisors = [
    {
      type: "conservative" as AdvisorType,
      icon: Shield,
      image: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=100&h=100&fit=crop"
    },
    {
      type: "growth" as AdvisorType,
      icon: TrendingUp,
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop"
    },
    {
      type: "quantitative" as AdvisorType,
      icon: Binary,
      image: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop"
    },
    {
      type: "meme" as AdvisorType,
      icon: Sparkles,
      image: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&h=100&fit=crop"
    },
  ];

  const handleAdvisorClick = async (advisorType: AdvisorType) => {
    console.log('Clicking advisor:', advisorType);
    try {
      if (!address) {
        console.log('No wallet connected');
        alert("请先连接钱包");
        return;
      }

      console.log('Checking access for:', advisorType);
      const hasAccess = await checkAccess(advisorType);
      console.log('Has access:', hasAccess);

      if (!hasAccess) {
        console.log('Unlocking advisor:', advisorType);
        await unlockAdvisor(advisorType);
        console.log('Checking access again for:', advisorType);
        const accessGranted = await checkAccess(advisorType);
        console.log('Access granted:', accessGranted);
        if (!accessGranted) {
          return;
        }
      }
      onAdvisorSelect(advisorType);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="flex flex-col space-y-4 max-w-2xl mx-auto">
      <h2 className="font-bold mx-4 text-lg">{t('advisor.title')}</h2>
      {advisors.map((advisor) => (
        <Card key={advisor.type} className="p-5 dark:bg-[rgba(35,35,35,0.60)]">
          <div className="flex items-center space-x-2 mb-4">
            <advisor.icon className="h-8 w-8" />
            <h3 className="font-semibold text-lg">{t(`advisor.${advisor.type}.name`)}</h3>
          </div>
          <div className="flex items-center space-x-2">
            <p className="text-base text-[#757575] ml-2 dark:text-foreground" style={{
                fontFamily: 'PingFang SC',
            }}>
              {t(`advisor.${advisor.type}.description`)}
            </p>
            <Button
              onClick={() => handleAdvisorClick(advisor.type)}
              disabled={unlockingAdvisor === advisor.type}
              className="rounded-2xl border-4 border-white bg-[#3287FF] shadow-[0px_4px_25.7px_rgba(153,153,153,0.13)] font-bold text-base block h-[5rem]
              dark:text-foreground dark:bg-[linear-gradient(90deg,#305AFC_0%,#5DD1FF_100%)] dark:border-0"
            >
              {unlockingAdvisor === advisor.type ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t('advisor.unlock.unlocking')}
                </>
              ) : (
                <>
                  <div>{t('advisor.unlock.button')}</div>
                  <div className="font-normal text-sm">
                    (0.00001 ETH)
                  </div>
                </>
              )}
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
}