{ pkgs ? import <nixpkgs> {} }:

pkgs.mkShell {
  buildInputs = with pkgs; [
    nodejs_22
    sqlite
  ];

  shellHook = ''
	export NIXPKGS_ALLOW_INSECURE=1
    echo "Node $(node --version) and sqlite ready"
	echo "Run API: cd api && npm install && node app.js"
	echo "Run WEB: cd web && npm install && npm run dev"
  '';
}
