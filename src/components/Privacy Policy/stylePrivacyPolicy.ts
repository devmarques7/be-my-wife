import styled from "styled-components";
import { Theme } from "@mui/material/styles";

interface StyledPrivacyPolicyProps {
  theme: Theme;
}

export const Component = styled.div<StyledPrivacyPolicyProps>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: fixed;
  bottom: 0;
  z-index: 99;

  width: 100vw;

  margin: 0 auto;
  padding: 10px 30px;

  background-color: ${({ theme }) => theme.palette.primary.light};

  .container {
    display: flex;

    gap: 2px;

    .policy {
      font: var(--ROBOTO-10px);
      font-size: 70%;
    }

    .policy.link {
      color: var(--black);

      font-weight: bolder;

      text-decoration: underline;
    }
  }

  .close.policy {
    border: none;
    background: transparent;
    font-size: 100%;
  }
`;
