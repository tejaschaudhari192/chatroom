import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

const cn = (...inputs: (string | undefined | null | boolean)[]) => {
  return inputs.filter(Boolean).join(' ');
};

const bubbleVariants = cva(
  "w-fit max-w-[80%] rounded-2xl px-4 py-3 shadow-lg",
  {
    variants: {
      intent: {
        incoming: "bg-gray-100 text-gray-900 dark:bg-gray-950 dark:text-gray-50",
        outgoing: "bg-gray-900 text-white dark:bg-gray-800",
      },
    },
    defaultVariants: {
      intent: "incoming",
    },
  }
);

export interface BubbleProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof bubbleVariants> {}

const Bubble = React.forwardRef<HTMLDivElement, BubbleProps>(
  ({ className, intent, ...props }, ref) => (
    <div
      className={cn(bubbleVariants({ intent }), className)}
      ref={ref}
      {...props}
    />
  )
);
Bubble.displayName = "Bubble";

export {Bubble,bubbleVariants};