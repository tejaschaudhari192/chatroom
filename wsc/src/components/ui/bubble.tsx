import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

// Utility to join class names
const cn = (...inputs: (string | undefined | null | boolean)[]) => {
  return inputs.filter(Boolean).join(' ');
};

// Define bubble style variants
const bubbleVariants = cva(
  "w-fit max-w-[80%] rounded-2xl px-4 py-3 shadow-md break-words",
  {
    variants: {
      intent: {
        incoming: "bg-gray-100 text-gray-900 dark:bg-gray-950 dark:text-gray-50",
        outgoing: "bg-blue-600 text-white dark:bg-blue-500",
      },
    },
    defaultVariants: {
      intent: "incoming",
    },
  }
);

export interface BubbleProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof bubbleVariants> {
  username?: string;
  message: string;
}

const Bubble = React.forwardRef<HTMLDivElement, BubbleProps>(
  ({ className, intent, username, message, ...props }, ref) => (
    <div
      className={cn(
        "flex flex-col gap-1 text-sm",
        bubbleVariants({ intent }),
        className
      )}
      ref={ref}
      {...props}
    >
      {username && (
        <span className="text-xs font-semibold opacity-70">{username}</span>
      )}
      <span>{message}</span>
    </div>
  )
);

Bubble.displayName = "Bubble";

export { Bubble, bubbleVariants };
