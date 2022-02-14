import cn from "classnames"
import { FC } from "react"

import { Button } from "."

interface CampaignsListPaginationProps {
  canGoBack: boolean
  canGoForward: boolean
  goBack: () => void
  goForward: () => void
  className?: string
}
export const CampaignsListPagination: FC<CampaignsListPaginationProps> = ({
  canGoBack,
  canGoForward,
  goBack,
  goForward,
  className,
}) => (
  <div className={cn("flex flex-row justify-between items-center", className)}>
    <Button onClick={goBack} disabled={!canGoBack}>
      Back
    </Button>
    <Button onClick={goForward} disabled={!canGoForward}>
      Next
    </Button>
  </div>
)
