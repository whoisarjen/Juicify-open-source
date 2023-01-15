import { type ReactNode } from "react"
import styled from 'styled-components'
import NavbarOnlyTitle from "@/components/NavbarOnlyTitle/NavbarOnlyTitle"

interface CoachContainerProps {
    title?: string
    description?: string
    children: ReactNode
}

const CoachContainerWrapper = styled.div`
    width: 100%;
    padding: 12px;
    box-sizing: border-box;
    height: calc(calc(100vh - var(--BothNavHeightAndPadding)) - env(safe-area-inset-bottom));
    display: flex;
    flex-direction: column;
    flex: 1;
    gap: 12px;
    align-items: center;
    text-align: center;
    ${this} > div {
        margin: auto;
    }
`

const TitleWrapper = styled.div`
    width: 100%;
    display: flex;
`

const DescriptionWrapper = styled.div`
    display: flex;
    flex: 1;
    align-items: center;
`

const CoachContainer = ({
    title,
    description,
    children,
}: CoachContainerProps) => {
    return (
        <CoachContainerWrapper>
            {!!title &&
                <TitleWrapper>
                    <NavbarOnlyTitle
                        title={title}
                    />
                </TitleWrapper>
            }
            {!!description &&
                <DescriptionWrapper>
                    {description}
                </DescriptionWrapper>
            }
            {children}
        </CoachContainerWrapper>
    )
}

export default CoachContainer