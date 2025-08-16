import { Box } from "@mui/material"
import { styled } from  "styled-components"

export const StyledLayout= styled(Box)`
    display: flex;
    flex-direction: column;
    width: 100vw;
    min-height: 100vh;
    overflow-x: hidden;
    
    /* Garantir que as seções tenham espaçamento adequado */
    & > * {
        margin-bottom: 0;
    }
    
    
    /* Responsividade para mobile */
    @media (max-width: 768px) {
        & > *:not(:last-child) {
            margin-bottom: 1rem;
        }
    }
`