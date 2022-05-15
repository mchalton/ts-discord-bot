export const errorHandler = (context: string, err: unknown): void => {
	const error = err as Error;
	console.error("error", `There was an error in the ${context}:`);
	console.error(JSON.stringify({ errorMessage: error.message, errorStack: error.stack }));
};
