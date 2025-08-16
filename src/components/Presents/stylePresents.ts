import styled from "styled-components";
import { Box } from "@mui/material";
import { Theme } from "@mui/material/styles";

interface StyledPresentsProps {
  theme: Theme;
}

export const StyledPresents = styled(Box)<StyledPresentsProps>`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
  min-height: 100vh;
  padding-top: 100px; /* Increased padding to account for fixed header */

  .presents-content {
    max-width: 1200px;
    width: 100%;
    padding: 2rem;
    background-color: ${({ theme }) => theme.palette.background.paper};
    border-radius: 1rem;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    margin-top: 20px; /* Additional margin for better spacing */

    @media (max-width: 768px) {
      padding: 1rem;
      margin-top: 10px;
    }

    h2 {
      color: ${({ theme }) => theme.palette.primary.main};
      text-align: center;
      margin-bottom: 1rem;
    }

    p {
      text-align: center;
      margin-bottom: 2rem;
      color: ${({ theme }) => theme.palette.text.secondary};
    }

    .category-title {
      color: ${({ theme }) => theme.palette.primary.main};
      margin-bottom: 2rem;
      padding-bottom: 0.5rem;
      border-bottom: 2px solid ${({ theme }) => theme.palette.primary.main};
    }

    .card {
      transition: transform 0.3s ease, box-shadow 0.3s ease;
      
      &:hover {
        transform: translateY(-5px);
        box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
      }

      .selected-badge {
        position: absolute;
        top: 1rem;
        right: 1rem;
        background-color: ${({ theme }) => theme.palette.success.main};
        color: white;
        padding: 0.5rem 1rem;
        border-radius: 1rem;
        font-size: 0.875rem;
      }
    }

    .back-home {
      display: inline-block;
      margin-top: 2rem;
      color: ${({ theme }) => theme.palette.primary.main};
      text-decoration: none;
      font-size: 1rem;
      padding: 0.5rem 1rem;
      border: 1px solid ${({ theme }) => theme.palette.primary.main};
      border-radius: 0.5rem;
      transition: all 0.3s ease;

      &:hover {
        background-color: ${({ theme }) => theme.palette.primary.main};
        color: white;
      }
    }
  }
`; 