 uploadFileToAws
 resourse is being used http://avijit-gorai.blogspot.com/2020/02/file-upload-into-aws-s3-using.html
# some changes has been made in AWS s3 bucket like..creating the bucket and allow CORS permission 
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
