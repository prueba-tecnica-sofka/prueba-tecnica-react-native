import React, { memo } from 'react';
import { Text, View } from 'react-native';

import { resultCounterStyles } from './ResultCounter.styles';

export interface ResultCounterProps {
	count: number;
	testID?: string;
}

function ResultCounterComponent({
	count,
	testID = 'result-counter',
}: ResultCounterProps): React.JSX.Element {
	const resultLabel = count === 1 ? 'resultado' : 'resultados';

	return (
		<View style={resultCounterStyles.container} testID={testID}>
			<Text style={resultCounterStyles.text} testID={`${testID}-text`}>
				{count} {resultLabel}
			</Text>
		</View>
	);
}

const ResultCounter = memo(ResultCounterComponent);
export default ResultCounter;
