# =========================================================
# Builder Stage: Compile the Rust/Wasm code
# =========================================================
FROM rustlang/rust:nightly AS builder

# Install wasm-pack
RUN cargo install wasm-pack

# Clone Zama's repo and build the Wasm package
RUN git clone https://github.com/zama-ai/tfhe-rs.git /tfhe-rs
WORKDIR /tfhe-rs/tfhe
RUN rustup override set nightly \
    && wasm-pack build --release --target=nodejs \
    --features=boolean-client-js-wasm-api,shortint-client-js-wasm-api

RUN ls -l /tfhe-rs/tfhe/pkg


# =========================================================
# Runtime Stage: Create the final Node.js image
# =========================================================
FROM node:20-slim AS runtime

# Update system packages to reduce vulnerabilities
RUN apt-get update && apt-get upgrade -y && apt-get clean && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# 1. Copy package.json first. This is a best practice for Docker caching.
COPY package.json ./

# 2. Run 'npm install'.
#    In your case, since there are no dependencies, this command will simply
#    create an empty 'node_modules' directory. This is PERFECT because
#    it sets up the folder we need for the next step.
RUN npm install

# 3. Copy the compiled Wasm package from the 'builder' stage.
#    This places your 'tfhe' module inside the 'node_modules' directory
#    that was just created.
COPY --from=builder /tfhe-rs/tfhe/pkg/ ./node_modules/tfhe/

# 4. Copy your application code.
COPY example.js ./

# 5. Set the command to run your application.
#    (Using '/bin/bash' will only open a shell and not run your code)
CMD ["node", "example.js"]