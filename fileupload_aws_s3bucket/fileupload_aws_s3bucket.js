import { LightningElement,wire,track,api } from 'lwc';
import { getRecord } from "lightning/uiRecordApi";
import { loadScript } from "lightning/platformResourceLoader";
import AWS_SDK from "@salesforce/resourceUrl/AWSS";

export default class Fileupload_aws_s3bucket extends LightningElement {


    /*========= Start - variable declaration =========*/
  s3; //store AWS S3 object
  isAwsSdkInitialized = false; //flag to check if AWS SDK initialized
  @api awsSettngRecordId; //store record id of custom metadata type where AWS configurations are stored
  selectedFilesToUpload; //store selected file
  @track showSpinner = false; //used for when to show spinner
  @track fileName; //to display the selected file name

  /*========= End - variable declaration =========*/

  //Called after every render of the component. This lifecycle hook is specific to Lightning Web Components,
  //it isn’t from the HTML custom elements specification.
   renderedCallback() {
    if (this.isAwsSdkInitialized) {
      return;
    }
    Promise.all([loadScript(this, AWS_SDK+'/aws-sdk-2.1098.0.min.js')])
      .then(() => {
        //For demo, hard coded the Record Id. It can dynamically be passed the record id based upon use cases
       // this.awsSettngRecordId = "2Fm015g000000rKZq";
        this.initializeAwsSdk();
        console.log('successfully file uploaded');
      })
      .catch(error => {
        console.error("error in javascript static resource fileupload-> " + error);
      });
  }

  //Using wire service getting AWS configuration from Custom Metadata type based upon record id passed

  @wire(getRecord, {
    recordId: "$awsSettngRecordId",
    fields: [
      "AWS_Setting__mdt.S3_Bucket_Name__c",
      "AWS_Setting__mdt.AWS_Access_Key_Id__c",
      "AWS_Setting__mdt.AWS_Secret_Access_Key__c",
      "AWS_Setting__mdt.S3_Region_Name__c"
    ]
  })
  awsConfigData({error,data}) {
    if(data) {
        console.log('in awsConfigData function '+data);
      let awsS3MetadataConf = {};
      let currentData = data.fields;
      console.log("AWS Conf ====> " + JSON.stringify(currentData));
      awsS3MetadataConf = {
        s3bucketName: currentData.S3_Bucket_Name__c.value,
        awsAccessKeyId: currentData.AWS_Access_Key_Id__c.value,
        awsSecretAccessKey: currentData.AWS_Secret_Access_Key__c.value,
        s3RegionName: currentData.S3_Region_Name__c.value
      };
      this.initializeAwsSdk(awsS3MetadataConf); //Initializing AWS SDK based upon configuration data
    } else if (error) {
      console.error("error ====> " + JSON.stringify(error));
    }
  }

  //Initializing AWS SDK
  initializeAwsSdk() {
    const AWS = window.AWS;
    AWS.config.update({
      accessKeyId: 'AKIAQ3OARRTOFFX3GE4J', //Assigning access key id
      secretAccessKey: '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' //Assigning secret access key
    });

    AWS.config.region = 'sa-east-1'; //Assigning region of S3 bucket

    this.s3 = new AWS.S3({
      apiVersion: "2006-03-01",
      params: {
        Bucket: 'dropbicket' //Assigning S3 bucket name
      }
    });
    this.isAwsSdkInitialized = true;
  }

  //get the file name from user's selection
  handleSelectedFiles(event) {
    if (event.target.files.length > 0) {
      this.selectedFilesToUpload = event.target.files[0];
      this.fileName = event.target.files[0].name;
      console.log("fileName ====> " + this.fileName);    }
  }

  //file upload to AWS S3 bucket
  uploadToAWS() {
    if (this.selectedFilesToUpload) {
      this.showSpinner = true;
      let objKey = this.selectedFilesToUpload.name
        .replace(/\s+/g, "_") //each space character is being replaced with _
        .toLowerCase();

      //starting file upload
      this.s3.putObject(
        {
          Key: objKey,
          ContentType: this.selectedFilesToUpload.type,
          Body: this.selectedFilesToUpload,
          ACL: "public-read"
        },
        err => {
          if (err) {
            this.showSpinner = false;
            console.error(err);
          } else {
            this.showSpinner = false;
            console.log("Success");
            this.listS3Objects();
          }
        }
      );
    }
  }

  //listing all stored documents from S3 bucket
  listS3Objects() {
    //console.log("AWS -> " + JSON.stringify(this.s3));
    this.s3.listObjects((err, data) => {
      if (err) {
        console.log("Error", err);
      } else {
        console.log("Success", data);
      }
    });
  }
}
