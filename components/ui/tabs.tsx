'use client';

import * as React from 'react';
import * as TabsPrimitive from '@radix-ui/react-tabs';

import { cn } from '@/lib/utils';

const Tabs = TabsPrimitive.Root;

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      'inline-flex h-10 items-center gap-4 justify-center rounded-md p-1 text-muted-foreground',
      className
    )}
    {...props}
  />
));
TabsList.displayName = TabsPrimitive.List.displayName;

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
  ref={ref}
  className={cn(
    `inline-flex items-center justify-center whitespace-nowrap
    rounded-full px-4 py-1 text-sm ring-offset-background
    transition-all
    focus-visible:outline-none
    focus-visible:ring-2
    focus-visible:ring-ring
    focus-visible:ring-offset-2
    disabled:pointer-events-none
    disabled:opacity-50
    font-bold
    data-[state=active]:bg-black
    data-[state=active]:text-white
    data-[state=active]:shadow-sm
    data-[state=inactive]:bg-white
    data-[state=inactive]:text-black
    dark:data-[state=active]:bg-[linear-gradient(345deg,_rgba(188,_186,_186,_0.40)_-14.24%,_rgba(52,_52,_52,_0.40)_123.01%)]
    dark:data-[state=active]:text-white
    dark:data-[state=active]:shadow-sm
    dark:data-[state=inactive]:bg-[rgba(68,68,68,0.40)]
    dark:data-[state=inactive]:text-[#AFAFAF]
    dark:data-[state=inactive]:shadow-[0px_4px_16px_0px_rgba(153,153,153,0.10)]
    dark:data-[state=inactive]:border-[4px_solid_#fff]
    `,
    className
  )}
  {...props}
/>
));
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      'mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
      className
    )}
    {...props}
  />
));
TabsContent.displayName = TabsPrimitive.Content.displayName;

export { Tabs, TabsList, TabsTrigger, TabsContent };
