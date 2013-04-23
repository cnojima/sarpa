Quick start!

Install node.js & npm (node package manager):
 - Using a package http://nodejs.org/#download

 - Using homebrew:
	brew install node

 - Using macports:
	port install nodejs  

 - Like a boss (CLI)
mkdir ~/local
echo 'export PATH=$HOME/local/bin:$PATH' >> ~/.bashrc
. ~/.bashrc
 
# could also fork, and then clone your own fork instead of the official one
 
git clone git://github.com/joyent/node.git
cd node
./configure --prefix=~/local
make install
cd ..
 
git clone git://github.com/isaacs/npm.git
cd npm
make install # or `make link` for bleeding edge


Install dependencies:
npm install


Start node server (in development mode)
npm start

Start node in production mode
node app.js