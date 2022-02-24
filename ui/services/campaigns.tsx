import fuzzysort from "fuzzysort"

import { daoUrlPrefix } from "@/config"
import { getFilterFns } from "@/helpers"
import { Status } from "@/types"

export const defaultNewCampaign: Partial<NewCampaign> = {
  hidden: false,
}

export const campaignsFromResponses = (
  campaignResponses: CampaignResponse[],
  includeHidden = false,
  includePending = false
): Campaign[] =>
  campaignResponses
    .filter(
      ({ campaign }) =>
        !!campaign &&
        (includeHidden || !campaign.hidden) &&
        (includePending || campaign.status !== Status.Pending)
    )
    .map(({ campaign }) => campaign!)

export const filterCampaigns = async (
  campaigns: Campaign[],
  filter?: string
) => {
  if (!filter) return campaigns

  const { query, filterFns } = getFilterFns(filter)

  if (filterFns)
    // Filter out campaigns that don't match all active filters.
    campaigns = campaigns.filter((campaign) =>
      filterFns.every((fn) => fn(campaign))
    )

  if (!query) return campaigns

  return (
    await fuzzysort.goAsync(query, campaigns, {
      keys: ["name", "description"],
      allowTypo: true,
    })
  ).map(({ obj }) => obj)
}

// Transform blockchain data into typed campaign object.
export const transformCampaign = (
  address: string,
  campaignState: any,
  campaignGovTokenBalance: number | undefined | null,
  daoGovTokenBalance: number | undefined | null,
  featuredAddresses?: string[],
  densAddressMap?: Record<string, string | undefined>
): Campaign | null => {
  const {
    campaign_info: campaignInfo,
    funding_token_info: fundingTokenInfo,
    gov_token_info: govTokenInfo,
    ...state
  } = campaignState ?? {}

  if (
    typeof campaignGovTokenBalance !== "number" ||
    typeof daoGovTokenBalance !== "number" ||
    !campaignInfo ||
    !fundingTokenInfo ||
    !govTokenInfo ||
    !state
  ) {
    return null
  }

  // Example: status={ "pending": {} }
  const status = Object.keys(state.status)[0] as Status

  return {
    address,
    name: campaignInfo.name,
    description: campaignInfo.description,
    // Use deNS name from map if available.
    urlPath: `/campaign/${densAddressMap?.[address] ?? address}`,
    imageUrl: campaignInfo.image_url,
    imageUrls: campaignInfo.image_urls ?? [
      "https://moonphase.is/image.svg",
      "https://moonphase.is/image.svg",
      "https://moonphase.is/image.svg",
      "https://moonphase.is/image.svg",
      "https://moonphase.is/image.svg",
    ],

    status,
    creator: state.creator,
    hidden: campaignInfo.hidden,
    featured: featuredAddresses?.includes(address) ?? false,

    goal: Number(state.funding_goal.amount) / 1e6,
    pledged: Number(state.funds_raised.amount) / 1e6,
    // backers: ,

    dao: {
      address: state.dao_addr,
      url: daoUrlPrefix + state.dao_addr,
    },

    govToken: {
      address: state.gov_token_addr,
      name: govTokenInfo.name,
      symbol: govTokenInfo.symbol,
      campaignBalance: campaignGovTokenBalance,
      daoBalance: daoGovTokenBalance,
      supply: Number(govTokenInfo.total_supply) / 1e6,
    },

    fundingToken: {
      address: state.funding_token_addr,
      ...(status === Status.Open && {
        price: Number(state.status[status].token_price),
        // Funding tokens are minted on-demand, so calculate the total that will ever exist
        // by multiplying the price of one token (in JUNO) by the goal (in JUNO).
        supply:
          (Number(state.funding_goal.amount) *
            Number(state.status[status].token_price)) /
          1e6,
      }),
      name: fundingTokenInfo.name,
      symbol: fundingTokenInfo.symbol,
    },

    website: campaignInfo.website,
    twitter: campaignInfo.twitter,
    discord: campaignInfo.discord,
  }
}
