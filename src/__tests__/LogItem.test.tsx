/**
 * @license
 * Copyright (c) 2026 Reinner Steven Daza Leiva
 * Contact: https://reivium.com/
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { render, fireEvent } from '@testing-library/react';
import { LogItem } from '../components/LogItem';
import React from 'react';

describe('LogItem Component', () => {
    const mockLog = {
        id: '1',
        timestamp: new Date().toISOString(),
        level: 'DEBUG' as const,
        message: 'Test message',
        title: 'Test Title'
    };

    it('should render log details', () => {
        const { getByText } = render(<LogItem log={mockLog} />);

        expect(getByText(/DEBUG/i)).not.toBeNull();
        expect(getByText(/Test Title/i)).not.toBeNull();
        expect(getByText(/Test message/i)).not.toBeNull();
    });

    it('should show icon for level', () => {
        const { getByText: debugText } = render(<LogItem log={mockLog} />);
        expect(debugText(/🐞/i)).not.toBeNull();

        const { getByText: errorText } = render(<LogItem log={{ ...mockLog, level: 'ERROR' }} />);
        expect(errorText(/❌/i)).not.toBeNull();

        const { getByText: objectText } = render(<LogItem log={{ ...mockLog, level: 'OBJECT' }} />);
        expect(objectText(/📦/i)).not.toBeNull();
    });

    it('should expand on click', () => {
        const { getByText, queryByText } = render(<LogItem log={mockLog} />);

        // Initially not expanded
        expect(queryByText(/Full message:/i)).toBeNull();

        // Click to expand
        fireEvent.click(getByText(/Test message/i));

        expect(getByText(/Full message: Test message/i)).not.toBeNull();
    });

    it('should show stack trace when provided', () => {
        const logWithStack = { ...mockLog, level: 'ERROR' as const, stack: 'Error stack trace' };
        const { getByText } = render(<LogItem log={logWithStack} />);

        fireEvent.click(getByText(/Test message/i));

        expect(getByText(/Stack Trace:/i)).not.toBeNull();
        expect(getByText(/Error stack trace/i)).not.toBeNull();
    });

    it('should show data when provided', () => {
        const testData = { key: 'value' };
        const logWithData = { ...mockLog, level: 'OBJECT' as const, data: testData };
        const { getByText } = render(<LogItem log={logWithData} />);

        fireEvent.click(getByText(/Test message/i));

        expect(getByText(/Payload:/i)).not.toBeNull();
        expect(getByText(/value/i)).not.toBeNull();
    });

    it('should handle JSON stringify errors', () => {
        const circular: any = {};
        circular.self = circular;
        const logWithCircular = { ...mockLog, level: 'OBJECT' as const, data: circular };
        const { getByText } = render(<LogItem log={logWithCircular} />);

        fireEvent.click(getByText(/Test message/i));

        expect(getByText(/Error parsing object/i)).not.toBeNull();
    });

    it('should copy text to clipboard', async () => {
        const writeTextMock = jest.fn().mockResolvedValue(undefined);
        Object.assign(navigator, {
            clipboard: {
                writeText: writeTextMock,
            },
        });

        const { getByTitle, findByText } = render(<LogItem log={mockLog} />);
        const copyBtn = getByTitle(/Copy to clipboard/i);

        fireEvent.click(copyBtn);

        expect(writeTextMock).toHaveBeenCalledWith('Test message');
        expect(await findByText('✅')).not.toBeNull();
    });
});
