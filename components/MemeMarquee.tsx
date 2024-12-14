"use client";

import { useMemeMarket } from '@/hooks/useMemeMarket';
import { useI18n } from '@/lib/i18n/I18nContext';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card } from './ui/card';
import { Skeleton } from './ui/skeleton';
import { AnimatedList } from './ui/animated-list';
interface Item {
  name: string;
  description: JSX.Element;
  icon: string;
  color: string;
  price: string;
  aiSentiment: string;
  token: any;
}
const MAX_NUM_TEXT = 60;
function getRandomEmoji() {
  // 定义一个包含常见 emoji 的数组
  const emojis = [
    "😀", "😂", "🥺", "😍", "🤔", "😎", "🤩", "🥳", "😜", "🤗",
    "😡", "😭", "😱", "🤖", "💩", "🔥", "🌟", "💎", "❤️", "🍕",
    "🌍", "🎉", "✨", "🦄", "🌈", "🐶", "🐱", "🦁", "🐰", "🐯"
  ];

  // 随机选择一个 emoji
  const randomIndex = Math.floor(Math.random() * emojis.length);
  return emojis[randomIndex];
}
function getRandomBrightColor() {
  // 随机生成 RGB 值，确保它们比较亮
  const r = Math.floor(Math.random() * 128) + 128; // 128 到 255 之间
  const g = Math.floor(Math.random() * 128) + 128; // 128 到 255 之间
  const b = Math.floor(Math.random() * 128) + 128; // 128 到 255 之间

  // 将 RGB 转换为 HEX 格式
  return `rgb(${r}, ${g}, ${b})`;
}
// Notification 组件
const Notification = ({ name, description, icon, color, price, aiSentiment, token }: Item) => {
  return (
    <figure
      className={cn(
        "relative mx-auto max-w-[98%] min-h-fit w-full cursor-pointer overflow-hidden rounded-2xl p-4",
        // animation styles
        "transition-all duration-200 ease-in-out hover:scale-[103%]",
        // light styles
        "rounded-[2.625rem] border-4 border-white bg-white shadow-[0px_4px_25.7px_rgba(153,153,153,0.13)]",
        // dark styles
        "transform-gpu dark:bg-[rgba(35,35,35,0.60)] dark:text-foreground dark:backdrop-blur-md dark:[border:1px_solid_rgba(255,255,255,.1)] dark:[box-shadow:0_-20px_80px_-20px_#ffffff1f_inset]",
      )}
    >
      <div className="flex flex-row items-center gap-3">
        <div
          className="flex items-center justify-center rounded-full w-[3.375rem] h-[3.375rem]"
          style={{
            backgroundColor: color,
            aspectRatio: "1", // 保证宽高比例一致，形成圆形
          }}
        >
          <span className="text-lg">{icon}</span>
        </div>
        <div className="flex flex-col overflow-hidden">
          <figcaption className="flex flex-row items-center whitespace-pre text-lg font-medium dark:text-white ">
            <span className="text-lg font-bold">{name}</span>
            <span className="text-base mx-3 text-[#7D7D7D] dark:text-[#9DFAFF]">{price}</span>
          </figcaption>
          {/* Description 展示 */}
          <p className="text-sm font-normal relative">
            {description}
          </p>
        </div>
      </div>
    </figure>
  );
};


export function MemeMarquee({ enableCache = true }: { enableCache?: boolean }) {
  const { memeTokens, isLoading, error } = useMemeMarket(enableCache);
  const { t } = useI18n();
  // 获取 description 的函数，合并 24h change 和 aiSentiment
  const getDescription = (token: any) => {
    const changeText = `${token.change24h > 0 ? "+" : "-"} ${Math.abs(token.change24h).toFixed(2)}%`;
    const aiSentimentText = token.aiSentiment.length > MAX_NUM_TEXT
      ? token.aiSentiment.substring(0, MAX_NUM_TEXT) + '...'  // 超过 100 字的部分会被省略
      : token.aiSentiment;

    return <>
      <div className='mb-2'>
        <span className="text-[#5D5D5D] font-semibold text-base dark:text-foreground">24h Change:</span>
        <span className={cn(
        "text-sm  relative rounded-md py-1 px-3 mx-5 font-semibold",
        token.change24h > 0 ? "text-[#24B566] bg-[#97F9C8] " : token.change24h < 0 ? "text-[#E23E3E] bg-[#FFB3B3]" : ""
      )}>{changeText}</span></div>
      <div className="text-sm text-gray-500 dark:text-foreground">{aiSentimentText}</div>
    </>;
  };
  if (error) {
    return (
      <div className="p-2 text-sm text-destructive bg-destructive/10 rounded">
        {error}
      </div>
    );
  }

  return (
    <Card className='dark:bg-[rgba(55,55,55,0.30)]'>
      <div>
        <h2 className="font-semibold text-xl mb-4">{t('meme.memeAnalysis')}</h2>
        <div className="text-[#3287FF] font-pingfang text-base font-medium leading-normal [--webkit-text-stroke-width:1px] [--webkit-text-stroke-color:#000] mb-8
        dark:text-foreground
        ">
          Analysis MEME coins
        </div>
      </div>
      {
        isLoading ? (
          <>
            <Skeleton count={3} />
          </>
        ) : <div className="relative max-h-[600px] overflow-y-auto p-0.5">
          <AnimatedList>
            {[...memeTokens].map((token, index) => (
              <Notification
                key={`${token.symbol}-${index}`}
                name={token.name}
                description={getDescription(token)} // 获取合并后的 description
                icon={getRandomEmoji()} // 随机生成一个 emoji
                color={getRandomBrightColor()} // 随机生成一个亮色
                price={`$${token.price.toFixed(4)}`}
                aiSentiment={token.aiSentiment} // 传递 aiSentiment 字段
                token={token}
              />
            ))}
          </AnimatedList>
        </div>
      }
    </Card>
  );
} 