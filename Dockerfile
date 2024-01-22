FROM ubuntu:latest

RUN apt-get update && apt-get install -y \
    wget \
    gnupg \
    software-properties-common \
    apt-transport-https \
    git \
    iputils-ping \
    iproute2 \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

RUN wget -qO- https://packages.microsoft.com/keys/microsoft.asc | gpg --dearmor > packages.microsoft.gpg \
    && install -o root -g root -m 644 packages.microsoft.gpg /usr/share/keyrings/ \
    && echo "deb [arch=amd64 signed-by=/usr/share/keyrings/packages.microsoft.gpg] https://packages.microsoft.com/repos/code stable main" > /etc/apt/sources.list.d/vscode.list

RUN apt-get update && apt-get install -y code

RUN apt update && \
    wget https://nodejs.org/download/release/v20.11.0/node-v20.11.0-linux-x64.tar.xz && \
    tar -xJf node-v20.11.0-linux-x64.tar.xz -C /usr/local --strip-components=1 && \
    rm node-v20.11.0-linux-x64.tar.xz

RUN apt update && apt install -y curl git python3 build-essential unzip
RUN npm install -g yo generator-code yarn

COPY ./doc/fold-ninja-1024.png /usr/share/code/resources/app/resources/linux/code.png

RUN git clone https://github.com/emscripten-core/emsdk.git && \
    cd emsdk && \
    ./emsdk install latest && \
    ./emsdk activate latest
ENV PATH="/emsdk:/emsdk/node/14.15.5_64bit/bin:/emsdk/upstream/emscripten:$PATH"

RUN useradd -m vscodeuser
USER vscodeuser


CMD ["code", "--no-sandbox", "--wait", "--verbose"]
