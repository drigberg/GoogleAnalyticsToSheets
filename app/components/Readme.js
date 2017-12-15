
import React, { Component } from 'react';

const tabStyle = {
  marginLeft: '40px'
};

class Readme extends Component {
  render() {
    return (
      <div style={{ display: this.props.display }} id="readme">
        <h2>Sheets Authorization:</h2>

        <p>1) Visit https://console.developers.google.com/apis/credentials</p>

        <p style={tabStyle}>Be sure that you’re logged in with the desired Google account.</p>

        <p style={tabStyle}>If you haven’t created a project, create one! If you have, select it.</p>

        <p>2) Click “create credentials” and select OAuth from the dropdown. Select “other” as the type. Name the project something memorable, like “Google Sheets Secret Key”.</p>

        <p>3) Click the download button to the right of the newly-generated client id. Move it somewhere where it WON'T be deleted or moved, and rename it something like `sheets_key.json`.</p>

        <p>4) In Analytics2Sheets, click the "load new sheets key" button and locate your new sheets key file.</p>


        <h2>Analytics Authorization:</h2>
        <p>1) Visit https://console.developers.google.com/permissions/serviceaccounts and click “Create service account”. </p>
        <p>2) Type a memorable name like “Google Analytics Private Key”. Select the “owner —> owner” role, and select “furnish a new private key.” Be sure that JSON is selected as the type. </p>
        <p>3) Click create. </p>
        <p style={tabStyle}>Note: As Google so kindly says: "Your new public/private key pair is generated and downloaded to your machine; it serves as the only copy of this key. You are responsible for storing it securely.”</p>

        <p>4) Move it somewhere where it WON'T be deleted or moved, and rename it something like `analytics_key.json`.</p>

        <p>5) Find the email in this key file. Follow these steps using that email address: https://support.google.com/analytics/answer/1009702?hl=en. You should only need read access for this key, for this project.</p>

        <p>6) In Analytics2Sheets, click the "load new analytics key" button and locate your new analytics key file.</p>
        </div>
    );
  }
}

export default Readme;

