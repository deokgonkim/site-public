#!/bin/bash

aws s3 cp .env.production s3://dgkimnet-deploy/public.dgkim.net/guest/.env

