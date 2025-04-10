import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import axios from 'axios';
import CandidateActivation from './CandidateActivation';

// Mock axios
jest.mock('axios');

const mockCandidates = [
  {
    id: 1,
    image: 'http://example.com/image1.jpg',
    fullname: 'John Doe',
    email: 'john@example.com',
    cni: 'http://example.com/cni1.pdf',
    require_diploma: 'http://example.com/diploma1.pdf',
    birth_certificate: 'http://example.com/birth1.pdf',
  },
  {
    id: 2,
    image: 'http://example.com/image2.jpg',
    fullname: 'Jane Smith',
    email: 'jane@example.com',
    cni: 'http://example.com/cni2.pdf',
    require_diploma: 'http://example.com/diploma2.pdf',
    birth_certificate: 'http://example.com/birth2.pdf',
  },
];

describe('CandidateActivation', () => {
  beforeEach(() => {
    axios.get.mockResolvedValue({ data: mockCandidates });
  });

  test('renders candidate list', async () => {
    render(<CandidateActivation />);

    await waitFor(() => {
      expect(screen.getByText('Pending Candidates')).toBeInTheDocument();
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    });
  });

  test('activates candidate', async () => {
    axios.post.mockResolvedValue({});
    render(<CandidateActivation />);

    await waitFor(() => {
      const activateButtons = screen.getAllByText('Activate');
      fireEvent.click(activateButtons[0]);
    });

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith('http://127.0.0.1:8000/api/candidates/activate/1/');
      expect(screen.queryByText('John Doe')).not.toBeInTheDocument();
    });
  });

  test('deletes candidate', async () => {
    axios.delete.mockResolvedValue({});
    render(<CandidateActivation />);

    await waitFor(() => {
      const deleteButtons = screen.getAllByText('Delete');
      fireEvent.click(deleteButtons[0]);
    });

    await waitFor(() => {
      expect(axios.delete).toHaveBeenCalledWith('http://127.0.0.1:8000/api/candidates/activate/1/');
      expect(screen.queryByText('John Doe')).not.toBeInTheDocument();
    });
  });

  test('handles API error', async () => {
    console.error = jest.fn();
    axios.get.mockRejectedValue(new Error('API Error'));

    render(<CandidateActivation />);

    await waitFor(() => {
      expect(console.error).toHaveBeenCalledWith('Error fetching candidates:', expect.any(Error));
    });
  });

  test('renders candidate documents links', async () => {
    render(<CandidateActivation />);

    await waitFor(() => {
      const viewLinks = screen.getAllByText('View');
      expect(viewLinks).toHaveLength(6); // 3 documents for each of the 2 candidates
      expect(viewLinks[0]).toHaveAttribute('href', 'http://example.com/cni1.pdf');
      expect(viewLinks[1]).toHaveAttribute('href', 'http://example.com/diploma1.pdf');
      expect(viewLinks[2]).toHaveAttribute('href', 'http://example.com/birth1.pdf');
    });
  });

  test('button hover effect', async () => {
    render(<CandidateActivation />);

    await waitFor(() => {
      const activateButton = screen.getAllByText('Activate')[0];
      fireEvent.mouseEnter(activateButton);
      expect(activateButton).toHaveStyle('background-color: #555');
      fireEvent.mouseLeave(activateButton);
      expect(activateButton).toHaveStyle('background-color: #333');
    });
  });
});