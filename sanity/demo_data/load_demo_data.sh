#!/bin/sh

# Checks to see if there is more data than there should be in a fresh instance of the project
# if not, user's testing dataset (for development) is populated with dummy data

. ./.env && TEST_DATASET=$(echo ${SANITY_STUDIO_PUBLIC_SANITY_DATASET_DEV})
echo "DATASET: ${TEST_DATASET}"
EMPTY_DATASET_SIZE=15
LINES=${EMPTY_DATASET_SIZE}
echo " LINES: "${LINES}""
LINES=$(sanity documents --dataset=${TEST_DATASET} --api-version="v2024-03-21" query 'count(*[])' )
echo "LINES = ${LINES}"
if test "$LINES" -lt "$EMPTY_DATASET_SIZE"; then
	echo "Populating (${TEST_DATASET}) dataset with dummy data"
	sanity dataset import  demo_data/testing.ndjson ${TEST_DATASET} --replace
else
	echo "dataset not empty, clear dataset to load dummy data"
fi