import React from "react";
import SponsorForm from "../../../components/SponsorForm/SponsorForm";
import { render } from "../../test-utils";

describe("Sponsor Form", () => {
    it("is form accesible", () => {

        render(<SponsorForm creatorName="Parichay" creatorId={"xyz"} fanId={"abc"} isDisabled={false} />);
        // TBD
    });
});
