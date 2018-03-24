import json
import elasticsearch
import elasticsearch.helpers

es = elasticsearch.Elasticsearch([{'host': '35.230.116.42', 'port': 9200}])
docs = json.load(open('../sample-data/products.json'))

success, failed = 0, 0
for ok, item in elasticsearch.helpers.streaming_bulk(es, docs):
    if not ok:
        failed += 1
    else:
        success += 1

print("inserted %s items successful, and failed %s items" % (success, failed))
