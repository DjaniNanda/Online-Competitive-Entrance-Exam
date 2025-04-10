import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { BrowserRouter as Router } from 'react-router-dom';
import  AuthContext  from '../context/AuthContext';
import Registerpage from './Registerpage';

// Mock the AuthContext
const mockRegisterUser = jest.fn();
const mockAuthContext = {
  registerUser: mockRegisterUser,
};

// Mock react-icons
jest.mock('react-icons/bi', () => ({
  BiUser: () => <div data-testid="mock-bi-user" />,
}));

describe('Registerpage', () => {
  const renderComponent = () =>
    render(
      <Router>
        <AuthContext.Provider value={mockAuthContext}>
          <Registerpage />
        </AuthContext.Provider>
      </Router>
    );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders register form', () => {
    renderComponent();
    expect(screen.getByRole('heading', { name: /register/i })).toBeInTheDocument();
    expect(screen.getByTestId('mock-bi-user')).toBeInTheDocument();
  });

  test('fills out form and submits', async () => {
    renderComponent();

    // Fill out the form
    fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByPlaceholderText('Username'), { target: { value: 'testuser' } });
    fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'password123' } });
    fireEvent.change(screen.getByPlaceholderText('Confirm Password'), { target: { value: 'password123' } });
    fireEvent.change(screen.getByPlaceholderText('Fullname'), { target: { value: 'Test User' } });
    
    // Select gender
    fireEvent.click(screen.getByLabelText('Male'));

    // Set date of birth
    fireEvent.change(screen.getByLabelText(/date of birth/i), { target: { value: '1990-01-01' } });

    // Mock file selection
    const file = new File(['dummy content'], 'test.png', { type: 'image/png' });
    fireEvent.change(screen.getByLabelText(/image/i), { target: { files: [file] } });
    fireEvent.change(screen.getByLabelText(/national certificate of identity/i), { target: { files: [file] } });
    fireEvent.change(screen.getByLabelText(/required diploma/i), { target: { files: [file] } });
    fireEvent.change(screen.getByLabelText(/birth certificate/i), { target: { files: [file] } });

    // Select group
    fireEvent.change(screen.getByLabelText(/group/i), { target: { value: '1' } });

    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /register/i }));

    // Wait for the registerUser function to be called
    await waitFor(() => {
      expect(mockRegisterUser).toHaveBeenCalledTimes(1);
    });

    // Check if the FormData was created correctly
    const formDataArg = mockRegisterUser.mock.calls[0][0];
    expect(formDataArg).toBeInstanceOf(FormData);
    expect(formDataArg.get('email')).toBe('test@example.com');
    expect(formDataArg.get('username')).toBe('testuser');
    expect(formDataArg.get('password')).toBe('password123');
    expect(formDataArg.get('password2')).toBe('password123');
    expect(formDataArg.get('fullname')).toBe('Test User');
    expect(formDataArg.get('gender')).toBe('1');
    expect(formDataArg.get('dob')).toBe('1990-01-01');
    expect(formDataArg.get('image')).toEqual(file);
    expect(formDataArg.get('cni')).toEqual(file);
    expect(formDataArg.get('require_diploma')).toEqual(file);
    expect(formDataArg.get('birth_certificate')).toEqual(file);
    expect(formDataArg.get('groups')).toBe('1');
  });

  test('displays login link', () => {
    renderComponent();
    const loginLink = screen.getByText('Login Now');
    expect(loginLink).toBeInTheDocument();
    expect(loginLink.getAttribute('href')).toBe('/login');
  });
});