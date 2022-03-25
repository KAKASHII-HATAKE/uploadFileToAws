 uploadFileToAws

resourse is being used http://avijit-gorai.blogspot.com/2020/02/file-upload-into-aws-s3-using.html
 
	some changes has been made in AWS s3 bucket like..creating the bucket and allow CORS permission 

NOTE :- For CORS in AWS
[
    {
        "AllowedHeaders": [
            "*"
        ],
        "AllowedMethods": [
            "PUT",
            "POST",
            "DELETE"
        ],
        "AllowedOrigins": [
            "https://dhoom-dev-ed.lightning.force.com"
        ],
        "ExposeHeaders": []
    }
]


Additional Info : we can use Apex to callout request to upload the file in AWS S3 bucket but there is a size limitation you can't upload more than 3mb file from apex
for the refrence : if you want to upload more than 3mb file than use above code 

https://santanuboral.blogspot.com/2020/01/LWC-FileUpload-AWS.html
