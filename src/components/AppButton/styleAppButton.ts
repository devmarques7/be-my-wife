import { Button } from 'antd';
import styled from 'styled-components';

export const StyledAppButton= styled(Button)`
    border: 1px solid ${({ theme }) => theme.palette.secondary.main} !important;
    color: ${({ theme }) => theme.palette.secondary.main} !important;

    span{
      font-family: ${({ theme }) => theme.typography.p.fontFamily} !important;
    }
`;
