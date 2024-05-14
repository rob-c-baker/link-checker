FROM ubuntu:24.04

WORKDIR /siteone-crawler

RUN apt-get update -y \
    && apt-get upgrade -y \
    && apt-get install git dnsutils -y \
    && apt-get clean \
    && git clone https://github.com/janreges/siteone-crawler.git .

ENTRYPOINT [ "/siteone-crawler/crawler" ]