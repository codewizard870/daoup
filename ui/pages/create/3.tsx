import type { NextPage } from "next"

import {
  Button,
  CenteredColumn,
  FormInput,
  ResponsiveDecoration,
} from "../../components"
import { useNewCampaignForm } from "../../helpers/form"

const Create3: NextPage = () => {
  const { formOnSubmit, register, errors } = useNewCampaignForm(3)

  return (
    <>
      <ResponsiveDecoration
        name="campaigns_orange_blur.png"
        width={406}
        height={626}
        className="top-0 right-0 opacity-70"
      />

      <CenteredColumn className="py-10 max-w-4xl">
        <form className="flex flex-col" onSubmit={formOnSubmit}>
          <h1 className="font-semibold text-4xl mb-10">Campaign Details</h1>

          <FormInput
            label="Website"
            placeholder="https://your.campaign"
            type="text"
            error={errors.website?.message}
            {...register("website", {
              required: false,
              pattern: /^https:\/\/.+$/,
            })}
          />

          <FormInput
            label="Twitter"
            placeholder="@CampaignDAO"
            type="text"
            error={errors.twitter?.message}
            {...register("twitter", {
              required: false,
              pattern: /^@.+$/,
            })}
          />

          <FormInput
            label="Discord"
            placeholder="https://discord.gg/campaign"
            type="text"
            error={errors.discord?.message}
            {...register("discord", {
              required: false,
              pattern: /^https:\/\/discord\.gg\/.+$/,
            })}
          />

          <FormInput
            label="Image URL"
            placeholder="https://your.campaign/logo.svg"
            type="text"
            error={errors.imageUrl?.message}
            {...register("imageUrl", {
              required: false,
              pattern: /^https:\/\/.+$/,
            })}
          />

          <div className="flex flex-row justify-between align-center">
            <Button submitLabel="Back" />
            <Button submitLabel="Next" />
          </div>
        </form>
      </CenteredColumn>
    </>
  )
}

export default Create3
