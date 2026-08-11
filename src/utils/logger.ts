type LogContext = Record<string, unknown>;

function formatContext(context?: LogContext): string {
  return context ? ` ${JSON.stringify(context)}` : '';
}

export const logger = {
  info(message: string, context?: LogContext) {
    console.log(`[INFO] ${message}${formatContext(context)}`);
  },
  error(message: string, context?: LogContext) {
    console.error(`[ERROR] ${message}${formatContext(context)}`);
  }
};
