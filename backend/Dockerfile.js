FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

# Copy seluruh source code backend dari laptop ke dalam container
COPY . .

# Buka port sesuai dengan yang lu pake di kodingan Node.js (misal 4000)
# Sesuaikan angka 4000 ini dengan port backend asli lu ya!
EXPOSE 4000

# Jalankan server utama lu
CMD ["npm", "start"]