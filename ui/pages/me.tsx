import type { NextPage } from "next"
import { FC } from "react"

import {
  Button,
  ButtonLink,
  CenteredColumn,
  ContributorCampaignCard,
  CreatorCampaignCard,
  ResponsiveDecoration,
  StatusIndicator,
  Suspense,
  TooltipInfo,
} from "../components"
import { useGetCampaigns } from "../hooks/useGetCampaigns"
import useWallet from "../hooks/useWallet"
import { categorizedWalletCampaigns } from "../services/campaigns"

const Me: NextPage = () => {
  const { walletAddress, connect } = useWallet()

  return (
    <>
      <ResponsiveDecoration
        name="me_green_blur.png"
        width={344}
        height={661}
        className="top-0 right-0 opacity-70"
      />

      <CenteredColumn className="pt-5 pb-10">
        <h1 className="font-semibold text-4xl">Your Wallet</h1>

        {!!walletAddress ? (
          <>
            <StatusIndicator
              color="green"
              label="Wallet connected."
              containerClassName="mt-5"
            />
            <p className="my-2">{walletAddress}</p>
          </>
        ) : (
          <>
            <p className="my-2">
              You haven&apos;t connected any wallets. Connect a wallet to start
              making contributions.
            </p>
            <p className="flex flex-row items-center">
              What&apos;s a wallet?
              <TooltipInfo text="" />
            </p>
            <Button className="mt-8" onClick={connect}>
              Connect a wallet
            </Button>
          </>
        )}

        <Suspense loader={{ containerClassName: "mt-16" }}>
          <MeContent walletAddress={walletAddress} />
        </Suspense>
      </CenteredColumn>
    </>
  )
}

interface MeContentProps {
  walletAddress: string | undefined
}
const MeContent: FC<MeContentProps> = ({ walletAddress }) => {
  const { campaigns, error } = useGetCampaigns()
  const { creatorCampaigns, contributorCampaigns } = categorizedWalletCampaigns(
    campaigns,
    walletAddress ?? ""
  )

  const campaignsBlock = (
    <>
      <h1 className="font-semibold text-4xl mt-16">Your Campaigns</h1>
      {creatorCampaigns.length ? (
        <div className="grid gap-4 grid-cols-1 lg:grid-cols-2 mt-8">
          {creatorCampaigns.map((campaign) => (
            <CreatorCampaignCard key={campaign.address} campaign={campaign} />
          ))}
        </div>
      ) : (
        <>
          <p className="mt-2 mb-8">You haven&apos;t created any campaigns.</p>
          <ButtonLink href="/create">Create a campaign</ButtonLink>
        </>
      )}
    </>
  )

  const contributionsBlock = (
    <>
      <h1 className="font-semibold text-4xl mt-16">Your Contributions</h1>
      {contributorCampaigns.length ? (
        <div className="grid gap-4 grid-cols-1 lg:grid-cols-2 mt-8">
          {contributorCampaigns.map((campaign) => (
            <ContributorCampaignCard
              key={campaign.address}
              campaign={campaign}
            />
          ))}
        </div>
      ) : (
        <>
          <p className="mt-2 mb-8">
            You haven&apos;t made any contributions to campaigns.
          </p>
          <ButtonLink href="/campaigns">View all campaigns</ButtonLink>
        </>
      )}
    </>
  )

  return (
    <>
      {!!walletAddress &&
        // If no user campaigns but user has contributed, show contributions first. Otherwise, default to campaigns on top.
        (contributorCampaigns.length && !creatorCampaigns.length ? (
          <>
            {contributionsBlock}
            {campaignsBlock}
          </>
        ) : (
          <>
            {campaignsBlock}
            {contributionsBlock}
          </>
        ))}
    </>
  )
}

export default Me