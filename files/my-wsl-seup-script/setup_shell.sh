#!/bin/bash

echo "Starting WSL Debian Setup..."

read -p "Enter your windows username: " win_user
read -p "Do you want to install packages (y/n): " install_packages

# Update the package list to be able to work with it properly.
echo "Updating, upgrading and autoremoving system..."
sudo apt-get update -y
sudo apt-get upgrade -y
sudo apt-get autoremove -y

if [[ "$install_packages" == "y" || "$install_packages" == "Y" ]]; then
    echo "Installing necessary packages..."
    sudo apt install -y \
        git curl wget build-essential gdb python3 python3-pip python3-venv unzip 

    echo "Setting up git."
    git config --global credential.helper "/mnt/c/Program\ Files/Git/mingw64/bin/git-credential-manager.exe"

    echo "Package installation completed."
else
    echo "Skipping package installation."
fi

# Modify .bashrc directly
BASHRC="$HOME/.bashrc"

echo "Modifying $BASHRC..."

# Ensure aliases are set
echo "Setting aliases..."
{
    echo ""
    echo "# Custom Aliases"
    echo "alias grep='grep --color=auto'"
    echo "alias update-all='sudo apt-get update -y && sudo apt-get upgrade -y && sudo apt-get autoremove -y'"
    echo "alias cls='clear'"
    echo "alias explorer='explorer.exe .'"
} >> "$BASHRC"

# Ensure environment variables are set
echo "Setting environment variables..."
{
    echo ""
    echo "'alias DESKTOP=/mnt/c/Users/$win_user/Desktop'"
} >> "$BASHRC"

# Ensure custom shell prompt is set
echo "Configuring shell prompt..."
echo "export PS1='\n<\A> \[\e[32m\]\u\[\e[m\] \[\e[34m\]\w\[\e[m\]\n        → '" >> "$BASHRC"

echo "WSL Debian setup completed! Run source $BASHRC for the changes to take effect."
