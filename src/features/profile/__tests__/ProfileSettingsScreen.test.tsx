import React from 'react';
import { render } from '@testing-library/react-native';
import { ProfileSettingsScreen } from '../ProfileSettingsScreen';

// Mock expo-router
jest.mock('expo-router', () => ({
    useRouter: () => ({
        back: jest.fn(),
        push: jest.fn(),
    }),
}));

describe('ProfileSettingsScreen', () => {
    it('renders correctly for account section', () => {
        const { getByText } = render(<ProfileSettingsScreen section="account" />);
        expect(getByText('Account Details')).toBeTruthy();
    });

    it('renders correctly for privacy section', () => {
        const { getByText } = render(<ProfileSettingsScreen section="privacy" />);
        expect(getByText('Privacy and Security')).toBeTruthy();
    });

    it('renders configuration text', () => {
        const { getByText } = render(<ProfileSettingsScreen section="general" />);
        expect(getByText('Configuring: general')).toBeTruthy();
    });
});
