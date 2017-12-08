
import React, { Component } from 'react';

class Readme extends Component {
  render() {
    return (
      <div style={{ display: this.props.display }} id="readme">
        <p>1) Visit https://console.developers.google.com/apis/credentials</p>

        <p className="tab">Be sure that you’re logged in with the desired Google account.</p>

        <p className="tab">If you haven’t created a project, create one! If you have, select it.</p>

        <p>2) Click “manage service accounts” in the bottom right. If you don’t have a service account, create one using the button at the top.</p>

        <p>3) Select the three dots to the right of your service account and create a key. Once it’s downloaded, move it (SOMEWHERE) and name it (SOMETHING).</p>


        <p>4) Go back to https://console.developers.google.com/apis/credentials</p>

        <p>5) Click “create credentials” and select OAuth from the dropdown. Select “other” as the type. Name the project something memorable, like “Google Sheets
          Secret Key”. Click the download button to the right of the newly-generated client id. Move it to the root directory of the project and rename it `client_secret.json`.</p>


        <h2>Analytics key:</h2>
        <p>1) Visit https://console.developers.google.com/permissions/serviceaccounts and click “Create service account”. </p>
        <p>2) Type a memorable name like “Google Analytics Private Key”. Select the “owner —> owner” role, and select “furnish a new private key.” Be sure that JSON is selected as the type. </p>
        <p>3) Click create. </p>
        <p className="tab">Note: As Google so kindly says: "Your new public/private key pair is generated and downloaded to your machine; it serves as the only copy of this key. You are responsible for storing it securely.”</p>

        <p>4) Move this file to the root directory of this project and rename it to `analytics_key.json`.</p>

        <p>5) Find the email in this key file. Follow these steps using that email address: https://support.google.com/analytics/answer/1009702?hl=en. You should only need read access for this key, for this project.</p>
      </div>
    );
  }
}

export default Readme;



