import { prettyPrintDecimal } from "../helpers/number"

const renderString = (v: string) => v
const renderBoolean = (v: boolean) => (v ? "Yes" : "No")
const makeRenderNumber =
  (maxDecimals?: number, minDecimals?: number) => (v: number) =>
    prettyPrintDecimal(v, maxDecimals, minDecimals)

const renderImageUrl = (imageUrl?: string) => (
  <>
    {imageUrl}
    {!!imageUrl && (
      // image is being loaded from anywhere, so can't use next image component
      // eslint-disable-next-line @next/next/no-img-element
      <img src={imageUrl} alt="" className="mt-2 max-w-[14rem]" />
    )}
  </>
)

export const newCampaignFields: Record<NewCampaignFieldKey, NewCampaignField> =
  {
    name: {
      label: "Name",
      pageId: 1,
      required: true,
      render: renderString,
    },
    description: {
      label: "Description",
      pageId: 1,
      required: true,
      render: renderString,
    },
    imageUrl: {
      label: "Image URL",
      pageId: 1,
      required: false,
      render: renderImageUrl,
    },
    goal: {
      label: "Funding Target",
      pageId: 1,
      required: true,
      unitBefore: (_) => "$",
      render: makeRenderNumber(2, 2),
    },
    daoAddress: {
      label: "DAO Address",
      pageId: 1,
      required: true,
      render: makeRenderNumber(2, 2),
    },
    tokenName: {
      label: "Campaign Token Name",
      pageId: 1,
      required: true,
      render: renderString,
    },
    tokenSymbol: {
      label: "Campaign Token Symbol",
      pageId: 1,
      required: true,
      render: renderString,
    },
    hidden: {
      label: "Hide from public campaigns list",
      pageId: 1,
      required: false,
      render: renderBoolean,
    },
    website: {
      label: "Website",
      pageId: 1,
      required: false,
      render: renderString,
    },
    twitter: {
      label: "Twitter",
      pageId: 1,
      required: false,
      render: renderString,
    },
    discord: {
      label: "Discord",
      pageId: 1,
      required: false,
      render: renderString,
    },
  }
export const newCampaignFieldEntries = Object.entries(newCampaignFields) as [
  NewCampaignFieldKey,
  NewCampaignField
][]

export const defaultNewCampaign: Partial<NewCampaign> = {
  hidden: false,
}

export const visibleCampaignsFromResponses = (
  campaignResponses: CampaignResponse[]
): Campaign[] =>
  campaignResponses
    .filter(({ campaign }) => !campaign?.hidden)
    .map(({ campaign }) => campaign!)

export const categorizedWalletCampaigns = (
  campaigns: Campaign[],
  address: string
) => ({
  creatorCampaigns: campaigns.filter((c) => c.creator === address),
  // TODO: Somehow figure out if this wallet is a supporter.
  contributorCampaigns: campaigns.filter(
    (c) =>
      // c.contributors.includes(address)
      c.creator !== address
  ),
})