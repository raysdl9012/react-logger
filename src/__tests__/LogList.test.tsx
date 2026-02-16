/**
 * @license
 * Copyright (c) 2026 Reinner Steven Daza Leiva
 * Contact: https://reivium.com/
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { render } from '@testing-library/react';
import { LogList } from '../components/LogList';
import React from 'react';

// Mock react-virtuoso
jest.mock('react-virtuoso', () => ({
    Virtuoso: ({ data, itemContent }: any) => (
        <div data-testid="virtuoso-mock">
            {data.map((item: any, index: number) => (
                <div key={item.id}>{itemContent(index, item)}</div>
            ))}
        </div>
    )
}));

describe('LogList Component', () => {
    const mockLogs = [
        { id: '1', level: 'DEBUG', message: 'First', timestamp: new Date().toISOString() },
        { id: '2', level: 'ERROR', message: 'Second', timestamp: new Date().toISOString() },
        { id: '3', level: 'DEBUG', message: 'Third', timestamp: new Date().toISOString(), title: 'Special' }
    ];

    it('should render all logs when no filter', () => {
        const { getAllByText } = render(<LogList logs={mockLogs} filter="ALL" search="" />);
        expect(getAllByText(/DEBUG|ERROR/)).toHaveLength(3);
    });

    it('should filter logs by level', () => {
        const { getAllByText, queryByText } = render(<LogList logs={mockLogs} filter="ERROR" search="" />);
        expect(getAllByText(/ERROR/)).toHaveLength(1);
        expect(queryByText(/First/)).toBeNull();
    });

    it('should search logs by message', () => {
        const { getByText, queryByText } = render(<LogList logs={mockLogs} filter="ALL" search="first" />);
        expect(getByText(/First/)).not.toBeNull();
        expect(queryByText(/Second/)).toBeNull();
    });

    it('should search logs by title', () => {
        const { getByText, queryByText } = render(<LogList logs={mockLogs} filter="ALL" search="special" />);
        expect(getByText(/Special/)).not.toBeNull();
        expect(queryByText(/First/)).toBeNull();
    });

    it('should reverse the logs for display', () => {
        const { getAllByTestId } = render(<LogList logs={mockLogs} filter="ALL" search="" />);
        // Since we reverse it: Third, Second, First
        const items = document.querySelectorAll('.liql-logItem');
        expect(items[0].textContent).toContain('Third');
        expect(items[2].textContent).toContain('First');
    });
});
